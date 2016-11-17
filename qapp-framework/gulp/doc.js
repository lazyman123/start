var fs = require('fs');

module.exports = function() {
    return {
        "name": "QApp",
        "options": {
            "js": {
                "lib": "js",
                "source": false,
                "format": true
            }
        },
        "common": {
            "title": "QApp",
            "footer": "Made By Qunar YMFE TEAM. © 2014 - 2016",
            "home": "HY",
            "homeUrl": "http://ued.qunar.com/mobile/",
            "navbars": [{
                "name": "QApp",
                "url": "http://ued.qunar.com/mobile/qapp/doc/"
            }, {
                "name": "Kami",
                "url": "http://ued.qunar.com/mobile/kami/doc/"
            }, {
                "name": "Yo",
                "url": "http://ued.qunar.com/mobile/yo/doc/"
            }, {
                "name": "QunarAPI",
                "url": "http://hy.qunar.com/docs/qunarapi-api.html"
            }, {
                "name": "QMB2",
                "url": "http://ued.qunar.com/mobile/qmb2/",
                "target": "_blank"
            }, {
                "name": "Statistics",
                "url": "http://ued.qunar.com/mobile/statistics/"
            }, {
                "name": "Blog",
                "url": "http://ued.qunar.com/mobile/blog/",
                "target": "_blank"
            }, {
                "name": "Hytive",
                "url": "http://hy.qunar.com/docs/index.html"
            }]
        },
        "pages": [{
            "name": "index",
            "title": "简介",
            "banner": {
                "title": "QApp Framework 简介",
                "description": "简洁 、轻量 、实用的移动前端开发框架"
            },
            "content": "./README.md"
        }, {
            "name": "api",
            "title": "API",
            "banner": {
                "title": "QApp Framework API",
                "description": "简洁 、轻量 、实用的移动前端开发框架"
            },
            "content": "./src/**/*.js",
            "ignore": ['./src/qapp.js', './src/qapp-dev.js', './src/qapp.min.js'],
            "compile": "js",
            "options": {
                "type": "lib",
                "categories": ['Base', 'View', 'Class:View', 'Event:View', 'Router', 'Util-Dom', 'Util-Fn', 'Sniff', 'Plugin', 'Widget']
            }
        }, {
            "name": "hybird",
            "title": "混合开发",
            "banner": {
                "title": "QApp Framework 混合开发",
                "description": "简洁 、轻量 、实用的移动前端开发框架"
            },
            "content": {
                "type": "blocks",
                "sidebar": true,
                "blocks": [{
                    name: '简介',
                    content: 'document/hybrid/README.md'
                }, {
                    name: 'Hy'
                }, {
                    name: 'Hy说明',
                    sub: true,
                    content: 'modules/hybrid/hy/README.md'
                }, {
                    name: 'Wechat'
                }, {
                    name: 'WeChat说明',
                    sub: true,
                    content: 'modules/hybrid/wx/README.md'
                }]
            }
        }, {
            "name": "plugins",
            "title": "插件",
            "banner": {
                "title": "QApp Framework 插件",
                "description": "简洁 、轻量 、实用的移动前端开发框架"
            },
            "content": {
                "type": "blocks",
                "sidebar": true,
                "blocks": fs.readdirSync('./modules/plugins/').map(function(plugin) {
                    return {
                        name: plugin,
                        content: './modules/plugins/' + plugin + '/README.md'
                    };
                })
            }
        }, {
            "name": "build",
            "title": "构建",
            "banner": {
                "title": "QApp Framework 构建",
                "description": "打包和构建"
            },
            "content": "./document/build.md"
        }, {
            "name": "changelog",
            "title": "版本",
            "banner": {
                "title": "QApp Framework 版本",
                "description": "版本记录 与 CHANGELOG"
            },
            "content": "./CHANGELOG.md"
        }]
    };
};
