(function() {
    var _path = require('path');
    var _scan = require('local-devices');
    var _assistant = require('google-assistant');
    var _assistantConfig = {
        auth: {
            // OAuth2 client_secret_*.json downloaded from Google Actions Console
            keyFilePath: _path.resolve(__dirname, 'client_secret.json'),
            // Saved tokens (will be created if it doesn't exist)
            savedTokensPath:  _path.resolve(__dirname, 'client_tokens.json')
        },
        conversation: {
            lang: 'en-US'
        }
    };

    const SCAN_INTERVALS_MS = {
        AWAY: '2000',
        HOME: '5000'
    };

    const CAMERAS = {
        NAMES: {
            CAM_1: 'Doggo Cam',
            CAM_2: 'People (Ellie) Cam',
        },
        COMMANDS: {
            ENABLE_MD: 'Enable motion detection',
            DISABLE_MD: 'Disable motion detection'
        }
    }
    // upper case here
    const MACS = ['CC:C0:79:F1:8F:47', 'XX:XX:XX:XX:XX:XX'];

    var _scanIntervalMs = SCAN_INTERVALS_MS.AWAY;
    var _interval;

    // start the assistant
    _assistant = new _assistant(_assistantConfig.auth)
        .on('ready', startScanning)
        .on('error', (err) => {
            console.log('Assistant Error: ' + err);
        });

    // start network scanning
    function startScanning() {
        _interval = setInterval(scanAndFilter, _scanIntervalMs);
    }

    function scanAndFilter() {
        _scan().then((devices) => {
            var match = devices.some((device) => {
                return MACS.includes(device.mac.toUpperCase());
            });

            if (match) {
                // someone is home
                _scanIntervalMs = SCAN_INTERVALS_MS.HOME;
                clearInterval(_interval);
                sendCommand(CAMERAS.COMMANDS.DISABLE_MD + ' on ' + CAMERAS.NAMES.CAM_1);
                sendCommand(CAMERAS.COMMANDS.ENABLE_MD + ' on ' + CAMERAS.NAMES.CAM_2);
                startScanning();
            } else {
                // no one is home
                _scanIntervalMs = SCAN_INTERVALS_MS.AWAY;
                clearInterval(_interval);
                sendCommand(CAMERAS.COMMANDS.ENABLE_MD + ' on ' + CAMERAS.NAMES.CAM_1);
                sendCommand(CAMERAS.COMMANDS.ENABLE_MD + ' on ' + CAMERAS.NAMES.CAM_2);
                startScanning();
            }
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