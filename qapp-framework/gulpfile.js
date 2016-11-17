var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var rename = require('gulp-rename');
var ydoc = require('ydoc');
var fs = require('fs');
var sysPath = require('path');
var runSequence = require('run-sequence');
var through = require('through2');
var prompt = require('prompt');
var optimist = require('optimist');
var browserify = require('browserify');
var stringify = require('stringify');

var jsonUtil = require('./gulp/lib/json.js');
var replaceContent = require('./gulp/lib/replaceContent.js');
var replaceCommentToLog = require('./gulp/lib/replaceCommentToLog.js');
var importReplace = require('./gulp/lib/import.js');

var packageConfg = require('./package.json');
var version = packageConfg.version;
var destPath = './build/' + version + '/'
var fileList = packageConfg.packFiles;
var docConfig = require('./gulp/doc.js')();

var moduleTasks = [];
var exportTasks = [];
var fekitTasks = [];

// Create Modules Tasks
fs.readdirSync('./modules/').forEach(function(type) {
    fs.readdirSync('./modules/' + type).filter(function(item) {
        return item.indexOf('.') != 0;
    }).forEach(function(name) {
        var task = type + '-' + name,
            fekitTask = 'fekit-' + task;
        moduleTasks.push(task);
        gulp.task(task, function() {
            return gulp.src('./modules/' + type + '/' + name + '/src/index.js')
                .pipe(concat(name + '.js'))
                .pipe(importReplace())
                .pipe(gulp.dest('./build/' + version + '/' + type));
        });

        fekitTasks.push(fekitTask);
        fekitTasks.push(fekitTask + '-config');
        gulp.task(fekitTask, function() {
            return gulp.src('./modules/' + type + '/' + name + '/src/index.js')
                .pipe(gulp.dest('fekit-cache/QApp-' + (type == 'plugins' ? 'plugin-' : '') + name + '/src'))
                .pipe(rename({
                    basename: name
                }))
                .pipe(gulp.dest('fekit-cache/QApp'));
        });
        gulp.task(fekitTask + '-config', function() {
            return gulp.src('gulp/fekit/fekit_modules.config')
                .pipe(through.obj(function(file, enc, cb) {
                    file.contents = new Buffer(
                        file.contents.toString(enc)
                        .replace(/\{\{name\}\}/g, name)
                        .replace(/\{\{prefix\}\}/g, type == 'plugins' ? 'plugin-' : '')
                        .replace(/\{\{version\}\}/g, version)
                        .replace(/\{\{desc\}\}/g, name + (type == 'plugins' ? ' plugin' : ' adapter'))
                    );
                    cb(null, file);
                }))
                .pipe(rename({
                    basename: 'fekit'
                }))
                .pipe(gulp.dest('fekit-cache/QApp-' + (type == 'plugins' ? 'plugin-' : '') + name));
        });
    });
});

// Create Exports Tasks
packageConfg.exports.forEach(function(item) {
    var task = "export-" + item.name;
    exportTasks.push(task);
    gulp.task(task, function() {
        return gulp.src(
                [destPath + 'qapp.js']
                .concat((item.plugins || []).map(function(name) {
                    return destPath + 'plugins/' + name + '.js';
                })).concat((item.hybrid || []).map(function(name) {
                    return destPath + 'hybrid/' + name + '.js';
                }))
            )
            .pipe(concat('qapp-' + item.name + '.js'))
            .pipe(gulp.dest(destPath))
    });
});

gulp.task('build-core', function() {
    return gulp.src(fileList)
        .pipe(concat('qapp.js'))
        .pipe(replaceContent(version))
        .pipe(importReplace())
        .pipe(gulp.dest(destPath));
});

gulp.task('build-modules', moduleTasks);

gulp.task('reload', function() {
    return gulp.src(['./src/**/*.js', './modules/**/*.js'])
        .pipe(connect.reload());
});


gulp.task('build', function(callback) {
    runSequence('build-core', moduleTasks, exportTasks, 'reload', callback);
});

gulp.task('custom', function(callback) {
    var fileName = 'qapp-' + (optimist.argv.n || optimist.argv.name || 'custom') + '.js',
        schema = {
            properties: {}
        },
        properties = schema.properties;

    moduleTasks.forEach(function(name) {
        properties[name] = {
            type: 'string',
            description: '是否打包 ' + name + ' ? (y/n)',
            pattern: /^[yn]$/,
            message: '是输入 y 或 n 或 不输入（=n）'
        };
    });

    gutil.log(gutil.colors.green('选择需要打包的模块:'));

    prompt.message = '[选择]';
    prompt.start();
    prompt.get(schema, function(err, result) {
        if (!err) {
            var modules = {
                plugins: [],
                hybrid: []
            }
            for (var key in result) {
                if (result[key] == 'y') {
                    modules[key.split('-')[0]].push(key.split('-')[1]);
                }
            }
            gulp.src(
                    [destPath + 'qapp.js']
                    .concat(modules.plugins.map(function(name) {
                        return destPath + 'plugins/' + name + '.js';
                    })).concat(modules.hybrid.map(function(name) {
                        return destPath + 'hybrid/' + name + '.js';
                    }))
                )
                .pipe(concat(fileName))
                .pipe(gulp.dest('./build/custom/'))
                .pipe(through.obj(function() {
                    gutil.log(gutil.colors.green('打包文件地址: ./build/custom/' + fileName))
                    callback();
                }));
        } else {
            callback();
        }
    });

});

gulp.task('dev', ['build'], function(callback) {
    return gulp.src([destPath + '*.js', '!' + destPath + '*.min.js', '!' + destPath + '*.dev.js'])
        .pipe(rename({
            suffix: '.dev'
        }))
        .pipe(replaceCommentToLog())
        .pipe(gulp.dest(destPath));
});

gulp.task('min', ['build'], function(callback) {
    return gulp.src([destPath + '*.js', '!' + destPath + '*.dev.js', '!' + destPath + '*.min.js'])
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest(destPath));
});

gulp.task('doc', function() {
    return gulp.src('./')
        .pipe(ydoc(docConfig));
});

gulp.task('demo-lib-scripts', function() {
    return gulp.src(['./build/' + version + '/qapp-hy.min.js'])
        .pipe(gulp.dest('./_docs/demo/scripts'));
});

gulp.task('demo-user-scripts', function(callback) {
    browserify(['./test/page/scripts/index.js'], {
        basedir: './'
    }).transform(stringify, {
        appliesTo: {
            includeExtensions: ['.string', '.html']
        }
    }).bundle(function(err, buf) {
        fs.writeFileSync('./_docs/demo/scripts/index.js', buf);
        callback();
    });
});

gulp.task('demo-user-image', function(callback) {
    return gulp.src(['./test/page/*.png']).
    pipe(gulp.dest('./_docs/demo'))
});

gulp.task('demo', ['demo-lib-scripts', 'demo-user-scripts', 'demo-user-image'], function() {
    return gulp.src(['./test/page/*.html', './test/page/**/*.css']).
    pipe(through.obj(function(file, enc, cb) {
        file.contents = new Buffer(file.contents.toString(enc).replace('qapp-hy.js', 'qapp-hy.min.js'));
        cb(null, file);
    })).
    pipe(gulp.dest('./_docs/demo'))
});

gulp.task('watch', function() {
    gulp.watch(['./src/**/*.js', './modules/**/*.js', './test/**/*.js', './test/**/*.html', './test/**/*.string'], ['build']);
});

gulp.task('server', ['watch'], function() {
    connect.server({
        livereload: true,
        middleware: function(connect, opt) {
            return [function(req, res, next) {
                gutil.log('Request URL:', req.url, sysPath.extname(req.url));
                if (sysPath.extname(req.url.split('?')[0]) == '.jsp') {
                    var htmlPath = sysPath.join(__dirname, sysPath.dirname(req.url), 'index.html');
                    if (fs.existsSync(htmlPath)) {
                        res.end(fs.readFileSync(htmlPath));
                        return;
                    }
                }
                next();
            }, function(req, res, next) {
                var filePath = req.originalUrl;
                if (/qapp-\w+(.dev|.min)?.js/.test(filePath)) {
                    filePath = '/build/' + version + '/' + filePath.match(/qapp-\w+(.dev|.min)?.js/)[0];
                }
                if (sysPath.extname(filePath) == '.js') {
                    browserify(['.' + filePath], {
                        basedir: './'
                    }).transform(stringify, {
                        appliesTo: {
                            includeExtensions: ['.string', '.html']
                        }
                    }).bundle(function(err, buf) {
                        if (err) {
                            console.log(err);
                            res.writeHead(500, {});
                            res.end();
                        } else {
                            res.end(buf);
                        }
                    });
                } else {
                    next();
                }
            }]
        }
    });
});

gulp.task('fekit-qapp', function() {
    return gulp.src([
        'build/' + version + '/qapp.js',
        'build/' + version + '/qapp.dev.js',
        'gulp/fekit/fekit.config'
    ]).
    pipe(rename(function(path) {
        if (path.basename == 'qapp.dev') {
            path.basename = 'dev';
        }
    })).
    pipe(through.obj(function(file, enc, cb) {
        file.contents = new Buffer(file.contents.toString(enc).replace(/\{\{version\}\}/g, version));
        cb(null, file);
    })).
    pipe(gulp.dest('fekit-cache/QApp'));
});

gulp.task('fekit', ['fekit-qapp'].concat(fekitTasks), function() {

});

gulp.task('all', function(callback) {
    runSequence('dev', 'min', 'doc', 'demo', callback);
});
