(function() {
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
    const STATES = {
        HOME: 0,
        AWAY: 1
    }

    var _path = require('path');
    var _scan = require('local-devices');
    var _assistant = require('google-assistant');
    var _assistantConfig = {
        auth: {
            // OAuth2 client_secret_*.json downloaded from Google Actions Console and renamed
            keyFilePath: _path.resolve(__dirname, CLIENT_SECTET_FILE),
            // Saved tokens file (will be created if it doesn't exist)
            savedTokensPath: _path.resolve(__dirname, CLIENT_TOKENS_FILE)
        },
        conversation: {
            lang: 'en-US'
        }
    };

    var _scanIntervalMs = SCAN_INTERVALS.AWAY;
    var _state = STATES.AWAY;

    // start the assistant and scanning
    _assistant = new _assistant(_assistantConfig.auth)
        .on('ready', startScanning)
        .on('error', (err) => {
            console.log('Assistant Error: ' + err);
        });

    function startScanning() {
        console.log('State:', _state);

        _scan().then((devices) => {
            console.log('Got:', devices.length, 'devices.');
            var match = devices.some((device) => {
                return MACS.includes(device.mac.toUpperCase());
            });

            if (match && _state === STATES.AWAY) {
                // someone just came home
                sendCommand(DISABLE_MD + ' on ' + CAM_1);
                sendCommand(DISABLE_MD + ' on ' + CAM_2);
                updateStateAndInterval(STATES.HOME, SCAN_INTERVALS.HOME);
            } else if (!match && _state === STATES.HOME) {
                // everyone just left
                sendCommand(ENABLE_MD + ' on ' + CAM_1);
                sendCommand(ENABLE_MD + ' on ' + CAM_2);
                updateStateAndInterval(STATES.AWAY, SCAN_INTERVALS.AWAY);
            }

            setTimeout(() => {
                startScanning();
            }, _scanIntervalMs);
        });

        function updateStateAndInterval(state, interval) {
            _state = state,
            _scanIntervalMs = interval;
        }
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