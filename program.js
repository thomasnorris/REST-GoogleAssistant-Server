(function() {
    const CONFIG_FOLDER = 'config';
    const CLIENT_SECTET_FILE = 'client_secret.json';
    const CLIENT_TOKENS_FILE = 'client_tokens.json';
    const CAM_1 = 'Doggo Cam';
    const CAM_2 = 'People (Ellie) Cam';
    const ENABLE_MD = 'Enable motion detection';
    const DISABLE_MD = 'Disable motion detection';
    // MACs should be cupper case
    const MACS = ['CC:C0:79:F1:8F:47', 'CC:C0:79:83:5B:18'];
    const SCAN_INTERVALS = {
        HOME: '5000',
        AWAY: '2000'
    };

    var _path = require('path');
    var _scan = require('local-devices');
    var _assistant = require('google-assistant');
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

    var _scanIntervalMs = SCAN_INTERVALS.AWAY;
    var _away = true;

    // start the assistant and scanning
    _assistant = new _assistant(_assistantConfig.auth)
        .on('ready', () => {
            startScanning(true);
        })
        .on('error', (err) => {
            console.log('Assistant Error: ' + err);
        });

    function startScanning(init = false) {
        _away ? console.log('Away') : console.log('Home');

        _scan().then((devices) => {
            console.log('Scanned', devices.length, 'devices.');
            var match = devices.some((device) => {
                return MACS.includes(device.mac.toUpperCase());
            });

            if (match && _away) {
                // someone just came home
                sendCommand(DISABLE_MD + ' on ' + CAM_1);
                sendCommand(DISABLE_MD + ' on ' + CAM_2);
                _scanIntervalMs = SCAN_INTERVALS.HOME;
                _away = false;
            } else if (init || (!match && !_away)) {
                // everyone just left
                sendCommand(ENABLE_MD + ' on ' + CAM_1);
                sendCommand(ENABLE_MD + ' on ' + CAM_2);
                _scanIntervalMs = SCAN_INTERVALS.AWAY;
                _away = true;
            }

            setTimeout(() => {
                startScanning();
            }, _scanIntervalMs);
        });
    }

    // log to a file maybe?
    function sendCommand(command) {
        _assistantConfig.conversation.textQuery = command;
        _assistant.start(_assistantConfig.conversation, (conversation) => {
            conversation
                .on('response', (text) => {
                    console.log('Assistant Response:', text)
                })
                .on('ended', (error) => {
                    if (error) {
                        console.log('Conversation Ended Error:', error);
                    } else {
                        console.log('Conversation Complete');
                        //conversation.end();
                    }
                })
                .on('error', (error) => {
                    console.log('Conversation Error:', error);
                });
        });
    }
})();