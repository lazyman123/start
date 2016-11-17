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
