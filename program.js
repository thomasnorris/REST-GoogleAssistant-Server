(function() {
    const CLIENT_SECTET_FILE = 'client_secret.json';
    const CLIENT_TOKENS_FILE = 'client_tokens.json';
    const CAM_1 = 'Doggo Cam';
    const CAM_2 = 'People (Ellie) Cam';
    const ENABLE_MD = 'Enable motion detection';
    const DISABLE_MD = 'Disable motion detection';
    // MACs should be cupper case
    const MACS = ['CC:C0:79:F1:8F:47', 'XX:XX:XX:XX:XX:XX'];
    // intervals are in ms
    const SCAN_INTERVALS = {
        AWAY: '2000',
        HOME: '5000'
    };

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

    // start the assistant and scanning
    _assistant = new _assistant(_assistantConfig.auth)
        .on('ready', startScanning)
        .on('error', (err) => {
            console.log('Assistant Error: ' + err);
        });

    function startScanning() {
        var interval;
        if (interval)
            clearInterval(interval);

        interval = setInterval(() => {
            _scan().then((devices) => {
                var match = devices.some((device) => {
                    return MACS.includes(device.mac.toUpperCase());
                });

                if (match) {
                    // someone is home
                    _scanIntervalMs = SCAN_INTERVALS.HOME;
                    sendCommand(DISABLE_MD + ' on ' + CAM_1);
                    sendCommand(ENABLE_MD + ' on ' + CAM_2);
                    startScanning();
                } else {
                    // no one is home
                    _scanIntervalMs = SCAN_INTERVALS.AWAY;
                    sendCommand(ENABLE_MD + ' on ' + CAM_1);
                    sendCommand(ENABLE_MD + ' on ' + CAM_2);
                    startScanning();
                }
            });
        }, _scanIntervalMs);
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