(function() {
    const CONFIG_FOLDER = 'config';
    const CLIENT_SECTET_FILE = 'client_secret.json';
    const CLIENT_TOKENS_FILE = 'client_tokens.json';

    const PORT = 1000;
    const ENDPOINTS = {
        SEND: '/send/:command?/:key?'
    }

    var _path = require('path');
    var _assistant = require('google-assistant');
    var _express = require('express');
    var _app = _express();
    var _assistantConfig = {
        auth: {
            // OAuth2 client_secret_*.json downloaded from Google Actions Console and renamed
            keyFilePath: _path.resolve(__dirname, CONFIG_FOLDER, CLIENT_SECTET_FILE),
            // Saved tokens file (will be created if it doesn't exist)
            savedTokensPath: _path.resolve(__dirname, CONFIG_FOLDER, CLIENT_TOKENS_FILE)
        },
        conversation: {
            lang: 'en-US'
        }
    };

    // start the assistant and scanning
    _assistant = new _assistant(_assistantConfig.auth)
        .on('ready', () => {
            ready();
        })
        .on('error', (err) => {
            console.log('Assistant Error: ' + err);
        });

    function ready() {
        console.log('Ready. Listening on port:', PORT);
        _app.get(ENDPOINTS.SEND, (req, res) => {
            // TODO: validation
            var command = req.params.command;
            if (!command)
                res.send('No command provided.');
            else
                sendCommand(command, (text) => {
                    res.send(text);
                });
        });
    }

    // log to a file maybe?
    function sendCommand(command, cb) {
        _assistantConfig.conversation.textQuery = command;
        _assistant.start(_assistantConfig.conversation, (conversation) => {
            conversation
                .on('response', (text) => {
                    if (!text)
                        text = 'Command accepted, but no response.'
                    cb(text);
                })
                // .on('ended', (error) => {
                //     if (error) {
                //         console.log('Conversation Ended Error:', error);
                //     } else {
                //         console.log('Conversation Complete');
                //         //conversation.end();
                //     }
                // })
                .on('error', (error) => {
                   cb('Assistant Error: ' + error);
                });
        });
    }

    _app.set('json spaces', 4);
    _app.listen(PORT);
})();