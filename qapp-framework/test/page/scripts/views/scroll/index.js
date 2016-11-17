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
