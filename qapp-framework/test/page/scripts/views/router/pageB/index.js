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
