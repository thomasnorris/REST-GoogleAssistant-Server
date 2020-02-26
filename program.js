(async function() {
    var _path = require('path');
    var _logger = require(_path.resolve(__dirname, 'Node-Logger', 'app.js'));
    await _logger.Init();

    var _assistant = require('google-assistant');
    var _express = require('express');
    var _app = _express();

    const PORT = 1000;

    const CONFIG_FOLDER = 'config';
    const CONFIG_FILE = 'config.json';
    const CLIENT_SECTET_FILE = 'client_secret.json';
    const CLIENT_TOKENS_FILE = 'client_tokens.json';
    const CONFIG = readJson(_path.resolve(__dirname, CONFIG_FOLDER, CONFIG_FILE));
    const ENDPOINTS = {
        SEND: '/send/:command?'
    }

    var _assistantConfig = {
        auth: {
            // OAuth2 client_secret_*.json downloaded from Google Actions Console and renamed
            keyFilePath: _path.resolve(__dirname, CONFIG_FOLDER, CLIENT_SECTET_FILE),
            // Saved tokens file (will be created if it doesn't exist)
            savedTokensPath: _path.resolve(__dirname, CONFIG_FOLDER, CLIENT_TOKENS_FILE)
        },
        conversation: {
            isNew: true,
            lang: 'en-US',
            deviceModelId: CONFIG.DEVICE.MODEL_ID,
            deviceLocation: {
                coordinates: {
                    latitude: CONFIG.DEVICE.LATITUDE,
                    longitude: CONFIG.DEVICE.LONGITUDE
                }
            }
        }
    };

    // start the assistant
    _assistant = new _assistant(_assistantConfig.auth)
        .on('ready', () => {
            _logger.Info.Async('Assistant ready.');
            ready();
        })
        .on('error', (err) => {
            _logger.Error.Async('Assistant error.', err);
            console.log('Assistant error: ' + err);
        });

    // listen for commands
    function ready() {
        console.log('Ready. Listening on port:', PORT);
        _app.get(ENDPOINTS.SEND, (req, res) => {
            var command = req.params.command;
            if (!authenticated(req.headers)) {
                var msg = 'Authentication failure.';
                _logger.Warning.Async(msg);
                res.status(401).send(msg);
            }

            else if (!command) {
                var msg = 'Command not provided.';
                _logger.Warning.Async(msg);
                res.status(400).send(msg);
            }

            else
                sendCommand(command, (text) => {
                    _logger.Info.Async('Command sent.', command)
                    _logger.Info.Async('Response received.', text);
                    res.send(text);
                });
        });

        function authenticated(headers) {
            return Object.keys(headers).some((key) => {
                if (key.toLowerCase() === CONFIG.AUTH.KEY.toLowerCase())
                    if (headers[key] === CONFIG.AUTH.VALUE)
                        return true;

                return false;
            });
        }
    }

    // log to a file maybe?
    function sendCommand(command, cb) {
        _assistantConfig.conversation.textQuery = command;
        _assistant.start(_assistantConfig.conversation, (conversation) => {
            conversation
                .on('response', (text) => {
                    if (!text)
                        text = 'Command was sent but there was no response from the Assistant.'
                    cb(text);
                })
                .on('ended', (error) => {
                    // should probably do something with this
                    conversation.end();
                })
                .on('error', (error) => {
                    conversation.end();
                });
        });
    }

    _app.set('json spaces', 4);
    _app.listen(PORT);

    function readJson(filePath) {
        var fs = require('fs');
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
})();
