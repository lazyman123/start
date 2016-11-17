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
