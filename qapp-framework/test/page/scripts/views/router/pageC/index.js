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