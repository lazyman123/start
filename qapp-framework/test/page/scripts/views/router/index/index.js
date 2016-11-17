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
