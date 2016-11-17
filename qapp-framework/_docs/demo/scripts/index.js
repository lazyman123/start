(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// 基础配置信息
QApp.hy.config({
    // 指定首页。值为页面的名字
    indexView: 'index',
    // 页面配置信息。
    viewOptions: {
        // 配置 'index' 页
        index: {
            // 导航栏配置信息
            nav: {
                // 中央标题配置信息
            	title: {
	                style: 'location',  // 显示位置图标
                    text: 'QApp Demo'       // 文字内容
	            }
            },
            // 页面显示时触发的回调
            onShow: function() {
                // alert('onShow')
            },
            // 页面激活时触发的回调
            onActived: function() {
                // alert('onActived')
            },
            // 页面失活时触发的回调
            onDeactived: function() {
                // alert('onDeactived')
            }
        },
        router: {
            nav: {
            	title: {
	                style: 'text',
	                text: 'Router'
	            }
            }
        },
        // 配置 'a' 页
        a: {
            nav: {
            	title: {
	                style: 'text',
	                text: 'A'
	            }
            }
        },
        // 配置 'b' 页
        b: {
            nav: {
            	title: {
	                style: 'text',
	                text: 'B'
	            }
            }
        },
        // 配置 'c' 页
        c: {
            nav: {
            	title: {
	                style: 'text',
	                text: 'C'
	            }
            }
        }
    }
});

},{}],2:[function(require,module,exports){
// 配置
require('./common.js');
require('./views/index.js');

},{"./common.js":1,"./views/index.js":5}],3:[function(require,module,exports){
var html = require('./tpl/index.string');

QApp.defineView('index', {
    html: html,
    classNames: ['yo-flex'],
    plugins: [
        'delegated'
    ],
    bindActions: {

    },
    bindEvents: {

    },
    ready: function() {

    }
});

},{"./tpl/index.string":4}],4:[function(require,module,exports){
module.exports = "<header class=\"yo-header m-pageD-hd\">\n    <span class=\"regret\" qapp-role=\"router\" href=\"#!back\">\n        <i class=\"yo-ico\">&#xf07d;</i>\n    </span>\n    <h2 class=\"title\">QApp Demo</h2>\n</header>\n<section class=\"flex\">\n    <div class=\"yo-list yo-list-group\">\n        <div class=\"item item-active\" qapp-role=\"router\" href=\"#router\">\n            <span class=\"flex\">router</span>\n            <i class=\"yo-ico\"></i>\n        </div>\n        <div class=\"item item-active\" qapp-role=\"router\" href=\"#scroll\">\n            <span class=\"flex\">scroll</span>\n            <i class=\"yo-ico\"></i>\n        </div>\n        <!-- <h2 class=\"label\">非服务器路由支持</h2>\n        <a class=\"item item-active\" href=\"origin.html\" target=\"_blank\">\n            <span class=\"flex\">/origin.html</span>\n            <i class=\"yo-ico\"></i>\n        </a>\n        <h2 class=\"label\">试一试复制</h2>\n        <div  class=\"item item-active\">\n            <input class=\"yo-input\" type=\"text\" value=\"QApp\" readOnly style=\"width:100%\"/>\n        </div>\n        <div class=\"item item-active\">\n            <textarea  style=\"width:100%;height:30px\">QApp Mobile Framework</textarea>\n        </div> -->\n        <h2 class=\"label\">demo gitlab 地址</h2>\n        <a class=\"item item-active\" href=\"http://gitlab.corp.qunar.com/qapp/qapp-demo\" target=\"_blank\">\n            <span class=\"flex\">git@gitlab.corp.qunar.com:qapp/qapp-demo.git</span>\n            <i class=\"yo-ico\"></i>\n        </a>\n    </div>\n</section>\n";

},{}],5:[function(require,module,exports){
require('./base');

// api
require('./router');
require('./scroll');

},{"./base":3,"./router":6,"./scroll":15}],6:[function(require,module,exports){
require('./index/index.js');
require('./pageA');
require('./pageB');
require('./pageC');

// QApp config
QApp.config({
    hashSupport: {
        except: ['c']
    }
});

},{"./index/index.js":7,"./pageA":9,"./pageB":11,"./pageC":13}],7:[function(require,module,exports){
// Base 视图
var _ = QApp.util,
    html = require('./tpl/index.string');

QApp.defineView('router', {
    html: html,
    // plugin: ['basic'],
    // 配置 嵌套
    bindEvents: {
        beforeShow: function() {
            console.log('[index] beforeShow');
        },
        show: function() {
            console.log('[index] show');
        },
        actived: function() {
            console.log('[index] actived');
        },
        deactived: function() {
            console.log('[index] deactived ')
        },
        receiveData: function(data) {
            console.log('[index] receiveData', data);
        },
        beforeHide: function() {
            console.log('[index] beforeHide');
        },
        hide: function() {
            console.log('[index] hide');
        },
        destroy: function() {
            console.log('[index] destroy');
        }
    },
    ready: function() {
        var me = this;

        console.log('[index] ready', me.param);

        // 通过 QApp.router.goto() 方法 实现跳转
        me.root.querySelector('#goto1').addEventListener('tap', function(e) {
            QApp.router.goto('a');
        });
        me.root.querySelector('#goto2').addEventListener('tap', function(e) {
            QApp.router.goto('a', {
                param: {
                    from: 'base',
                    to: 'a',
                    by: 'Qapp.router.goto'
                }
            });
        });

        // 通过 QApp.open() 方法 实现跳转
        me.root.querySelector('#open1').addEventListener('tap', function() {
            QApp.open('a')
        });
        me.root.querySelector('#open2').addEventListener('click', function() {
            QApp.open('a', {
                param: {
                    num: 1,
                    from: 'base',
                    to: 'a',
                    by: 'Qapp.open'
                }
            })
        });
    }
});

},{"./tpl/index.string":8}],8:[function(require,module,exports){
module.exports = "<header class=\"yo-header m-pageD-hd\">\n    <span class=\"regret\" qapp-role=\"router\" href=\"#!back\">\n        <i class=\"yo-ico\">&#xf07d;</i>\n    </span>\n    <h2 class=\"title\">router</h2>\n</header>\n<div class=\"yo-list yo-list-group\">\n\n    <h2 class=\"label\">跳转</h2>\n    <!-- 通过对标签添加 href 和 qapp-role 属性实现跳转 -->\n    <div class=\"item item-active\" href=\"#a\" qapp-role=\"router\">\n        <span class=\"flex\">goto pageA</span>\n        <i class=\"yo-ico\"></i>\n    </div>\n    <div class=\"item item-active\" href=\"#a?from=base&to=a\" qapp-role=\"router\" param=\"from=index&by=href\">\n        <span class=\"flex\">goto pageA（携带参数）</span>\n        <i class=\"yo-ico\"></i>\n    </div>\n    \n    <h2 class=\"label\">跳转（QApp.router.goto）</h2>\n    <!-- 通过 js QApp.router.goto(viewName) 方法 实现跳转 -->\n    <div class=\"item item-active\" id=\"goto1\">\n        <span class=\"flex\">goto pageA</span>\n        <i class=\"yo-ico\"></i>\n    </div>\n    <div class=\"item item-active\" id=\"goto2\">\n        <span class=\"flex\">goto pageA（携带参数）</span>\n        <i class=\"yo-ico\"></i>\n    </div>\n\n    <h2 class=\"label\">跳转（QApp.open）</h2>\n    <!-- 通过 js QApp.open(viewName) 方法 实现跳转 -->\n    <div class=\"item item-active\" id=\"open1\">\n        <span class=\"flex\">goto pageA</span>\n        <i class=\"yo-ico\"></i>\n    </div>\n    <div class=\"item item-active\" id=\"open2\">\n        <span class=\"flex\">goto pageA（携带参数）</span>\n        <i class=\"yo-ico\"></i>\n    </div>\n\n</div>";

},{}],9:[function(require,module,exports){
var _ = QApp.util;

var html = require('./tpl/index.string');

QApp.defineView('a', {
    html: html,
    bindEvents: {
        beforeShow: function() {
            console.log('[A] beforeShow');
        },
        show: function() {
            console.log('[A] show');
        },
        actived: function() {
            console.log('[A] actived');
        },
        deactived: function() {
            console.log('[A] deactived ')
        },
        receiveData: function(data) {
            console.log('[A] receiveData', data);
        },
        beforeHide: function() {
            console.log('[A] beforeHide');
        },
        hide: function() {
            console.log('[A] hide');
        },
        destroy: function() {
            console.log('[A] destroy');
        }
    },
    ready: function() {
    	var me = this;

        console.log('[A] ready', me.param);

        me.root.querySelector('#hide').addEventListener('tap', function() {
            // 通过 View.hide(data) 方法实现返回前一个历史，并传数据
            me.hide({
                from: 'a',
                action: 'hide'
            });
        });
    }
});

},{"./tpl/index.string":10}],10:[function(require,module,exports){
module.exports = "<header class=\"yo-header\">\n    <span class=\"regret\" qapp-role=\"router\" href=\"#!back\">\n        <i class=\"yo-ico\">&#xf07d;</i>\n    </span>\n    <h2 class=\"title\">A</h2>\n</header>\n<div class=\"yo-list yo-list-group\">\n    <h2 class=\"label\">返回</h2>\n    <!-- 通过 href '#!back' 实现返回前一个历史 -->\n    <div class=\"item item-active\" href=\"#!back\" qapp-role=\"router\" param=\"by=href\">\n        <span class=\"flex\">back</span>\n        <i class=\"yo-ico\"></i>\n    </div>\n    <!-- 通过 href '#viewName'，有则返回，无则新开 -->\n    <div class=\"item item-active\" href=\"#index\" qapp-role=\"router\">\n        <span class=\"flex\">goto index</span>\n        <i class=\"yo-ico\"></i>\n    </div>\n    <!-- 通过 js View.hide(data) 方法实现返回前一个历史，并传数据 -->\n    <div class=\"item item-active\" id=\"hide\">\n        <span class=\"flex\">hide</span>\n        <i class=\"yo-ico\"></i>\n    </div>\n\n    <h2 class=\"label\">跳转（新的历史）</h2>\n    <!-- 通过 target=\"_blank\" 创建新的历史（不会寻找已有历史） -->\n    <div class=\"item item-active\" href=\"#index\" qapp-role=\"router\" target=\"_blank\">\n        <span class=\"flex\">goto index</span>\n        <i class=\"yo-ico\"></i>\n    </div>\n    <div class=\"item item-active\" href=\"#b\" qapp-role=\"router\" target=\"_blank\">\n        <span class=\"flex\">goto pageB</span>\n        <i class=\"yo-ico\"></i>\n    </div>\n\n    <h2 class=\"label\">跳转（无历史）</h2>\n    <!-- 通过配置黑名单实现不记录指定历史 -->\n    <div class=\"item item-active\" href=\"#c\" qapp-role=\"router\">\n        <span class=\"flex\">goto pageC</span>\n        <i class=\"yo-ico\"></i>\n    </div>\n</div>";

},{}],11:[function(require,module,exports){
var _ = QApp.util;

var html = require('./tpl/index.string');

QApp.defineView('b', {
    html: html,
    bindEvents: {
        'show': function() {
           QApp.logger.debug('B: show');
        },
        'actived': function() {
           QApp.logger.debug('B: actived');
        },
        'deactived': function() {
           QApp.logger.debug('B: deactived ')
        },
        'receiveData': function(data) {
           QApp.logger.debug('B: receive data:', data);
        }
    },
    ready: function() {
        var me = this;
        me.root.querySelector('#exit').addEventListener('tap', function() {
            QApp.router.exit()
        });
    }
});

},{"./tpl/index.string":12}],12:[function(require,module,exports){
module.exports = "<header class=\"yo-header\">\n    <span class=\"regret\" qapp-role=\"router\" href=\"#!back\">\n        <i class=\"yo-ico\">&#xf07d;</i>\n    </span>\n    <h2 class=\"title\">B</h2>\n</header>\n<div class=\"yo-list yo-list-group\">\n    <h2 class=\"label\">返回</h2>\n    <!-- 通过 href '#!back' 实现返回前一个历史 -->\n    <div class=\"item item-active\" href=\"#!back\" qapp-role=\"router\">\n        <span class=\"flex\">back</span>\n        <i class=\"yo-ico\"></i>\n    </div>\n    <!-- 通过 href '#!back(n)' 实现返回指定历史 -->\n    <div class=\"item item-active\" href=\"#!back(2)\" qapp-role=\"router\">\n        <span class=\"flex\">back(2)</span>\n        <i class=\"yo-ico\"></i>\n    </div>\n    <!-- 通过 href '#viewName'，有则返回，无则新开 -->\n    <div class=\"item item-active\" href=\"#a\" qapp-role=\"router\">\n        <span class=\"flex\">backTo A</span>\n        <i class=\"yo-ico\"></i>\n    </div>\n    <!-- 通过 href '#viewName'，有则返回，无则新开 -->\n    <div class=\"item item-active\" href=\"#index\" qapp-role=\"router\">\n        <span class=\"flex\">backTo index</span>\n        <i class=\"yo-ico\"></i>\n    </div>\n    <!-- 通过 href '#!home' 实现返回第一个历史 -->\n    <div class=\"item item-active\" href=\"#!home\" qapp-role=\"router\" param=\"by=href\">\n        <span class=\"flex\">backTo home</span>\n        <i class=\"yo-ico\"></i>\n    </div>\n\n    <h2 class=\"label\">退出</h2>\n    <!-- 通过 href '!back' 实现返回前一个历史 -->\n    <div class=\"item item-active\" id=\"exit\">\n        <span class=\"flex\">exit</span>\n        <i class=\"yo-ico\"></i>\n    </div>\n</div>";

},{}],13:[function(require,module,exports){
var _ = QApp.util;

var html = require('./tpl/index.string');

QApp.defineView('c', {
    html: html,
    bindEvents: {
        'show': function() {
           QApp.logger.debug('C: show');
        },
        'actived': function() {
           QApp.logger.debug('C: actived');
        },
        'deactived': function() {
           QApp.logger.debug('C: deactived ')
        },
        'receiveData': function(data) {
           QApp.logger.debug('C: receive data:', data);
        }
    }
});
},{"./tpl/index.string":14}],14:[function(require,module,exports){
module.exports = "<header class=\"yo-header\">\n    <span class=\"regret\" qapp-role=\"router\" href=\"#!back\">\n        <i class=\"yo-ico\">&#xf07d;</i>\n    </span>\n    <h2 class=\"title\">C</h2>\n</header>\n<div class=\"yo-list yo-list-group\">\n    <h2 class=\"label\">返回</h2>\n    <!-- 通过 href '!back' 实现返回前一个历史 -->\n    <div class=\"item item-active\" href=\"#!back\" qapp-role=\"router\">\n        <span class=\"flex\">back</span>\n        <i class=\"yo-ico\"></i>\n    </div>\n    <!-- 通过 href '!viewName' 实现返回指定历史 -->\n    <div class=\"item item-active\" href=\"#a\" qapp-role=\"router\">\n        <span class=\"flex\">backTo A</span>\n        <i class=\"yo-ico\"></i>\n    </div>\n    <!-- 通过 href '!viewName' 实现返回指定历史 -->\n    <div class=\"item item-active\" href=\"#index\" qapp-role=\"router\">\n        <span class=\"flex\">backTo index</span>\n        <i class=\"yo-ico\"></i>\n    </div>\n</div>";

},{}],15:[function(require,module,exports){
var html = require('./tpl/index.string');

QApp.defineView('scroll', {
    html: html,
    plugins: [
        'scroll'
    ],
    bindEvents: {

    },
    ready: function() {

    }
});

},{"./tpl/index.string":16}],16:[function(require,module,exports){
module.exports = "<div class=\"m-view\">\n    <header class=\"yo-header m-pageD-hd\">\n        <span class=\"regret\" qapp-role=\"router\" href=\"#!back\">\n            <i class=\"yo-ico\">&#xf07d;</i>\n        </span>\n        <h2 class=\"title\">scroll</h2>\n    </header>\n    <h2 class=\"label\">横向滚动</h2>\n    <div class=\"raw-scroll\" qapp-widget=\"scroll\" data-scroll-scroll-x=\"true\">\n        <ul>\n            <li>1</li>\n            <li>2</li>\n            <li>3</li>\n            <li>4</li>\n            <li>5</li>\n            <li>6</li>\n            <li>7</li>\n            <li>8</li>\n            <li>9</li>\n            <li>10</li>\n        </ul>\n    </div>\n    <h2 class=\"label\">纵向滚动</h2>\n    <div class=\"flex\" qapp-widget=\"scroll\">\n        <div class=\"yo-list yo-list-group\">\n            <div id=\"gesture\" class=\"item item-active\" action-type=\"xxx\">\n                <span class=\"flex\">xxx</span>\n            </div>\n            <div class=\"item item-active\" action-type=\"yyy\">\n                <span class=\"flex\">yyy</span>\n            </div>\n            <div id=\"gesture\" class=\"item item-active\" action-type=\"xxx\">\n                <span class=\"flex\">xxx</span>\n            </div>\n            <div class=\"item item-active\" action-type=\"yyy\">\n                <span class=\"flex\">yyy</span>\n            </div>\n            <div id=\"gesture\" class=\"item item-active\" action-type=\"xxx\">\n                <span class=\"flex\">xxx</span>\n            </div>\n            <div class=\"item item-active\" action-type=\"yyy\">\n                <span class=\"flex\">yyy</span>\n            </div>\n            <div id=\"gesture\" class=\"item item-active\" action-type=\"xxx\">\n                <span class=\"flex\">xxx</span>\n            </div>\n            <div class=\"item item-active\" action-type=\"yyy\">\n                <span class=\"flex\">yyy</span>\n            </div>\n            <div id=\"gesture\" class=\"item item-active\" action-type=\"xxx\">\n                <span class=\"flex\">xxx</span>\n            </div>\n            <div class=\"item item-active\" action-type=\"yyy\">\n                <span class=\"flex\">yyy</span>\n            </div>\n            <div id=\"gesture\" class=\"item item-active\" action-type=\"xxx\">\n                <span class=\"flex\">xxx</span>\n            </div>\n            <div class=\"item item-active\" action-type=\"yyy\">\n                <span class=\"flex\">yyy</span>\n            </div>\n            <div id=\"gesture\" class=\"item item-active\" action-type=\"xxx\">\n                <span class=\"flex\">xxx</span>\n            </div>\n            <div class=\"item item-active\" action-type=\"yyy\">\n                <span class=\"flex\">yyy</span>\n            </div>\n            <div id=\"gesture\" class=\"item item-active\" action-type=\"xxx\">\n                <span class=\"flex\">xxx</span>\n            </div>\n            <div class=\"item item-active\" action-type=\"yyy\">\n                <span class=\"flex\">yyy</span>\n            </div>\n        </div>\n    </div>\n</div>";

},{}]},{},[2]);
