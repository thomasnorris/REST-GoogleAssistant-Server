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

    const CAM_1 = 'Doggo Cam';
    const CAM_2 = 'People (Ellie) Cam';
    const ENABLE_MD = 'Enable motion detection';
    const DISABLE_MD = 'Disable motion detection';
    const SCAN_INTERVALS = {
        AWAY: '2000',
        HOME: '5000'
    };

    // upper case
    const MACS = ['CC:C0:79:F1:8F:47', 'XX:XX:XX:XX:XX:XX'];

    var _scanIntervalMs = SCAN_INTERVALS.AWAY;
    var _interval;

    // start the assistant
    _assistant = new _assistant(_assistantConfig.auth)
        .on('ready', startScanning)
        .on('error', (err) => {
            console.log('Assistant Error: ' + err);
        });

    // start network scanning
    function startScanning() {
        if (_interval)
            clearInterval(_interval);
        _interval = setInterval(scanAndFilter, _scanIntervalMs);
    }

    function scanAndFilter() {
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