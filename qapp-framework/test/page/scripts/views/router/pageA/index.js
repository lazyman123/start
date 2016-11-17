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
