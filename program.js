(function() {
    const ASSISTANT_CONFIG = {
        auth: {
            keyFilePath: _path.resolve(__dirname, 'api-key.json'),
            savedTokensPath: _path.resolve(__dirname, 'saved-tokens.json')
        }
    };

    var _path = require('path');
    var _assistant = new require('google-assistant')(ASSISTANT_CONFIG.auth);

})();