(function() {
    var _path = require('path');
    var _readline = require('readline');
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

    // start the assistant
    _assistant = new _assistant(_assistantConfig.auth)
        .on('ready', promptForInput)
        .on('error', (err) => {
            console.log('Assistant Error: ' + err);
        });

    function startConversation(conversation) {
        conversation
            .on('response', (text) => {
                console.log('Assistant Response:', text)
            })

            // once the conversation is ended, see if we need to follow up
            .on('ended', (error, continueConversation) => {
                if (error) {
                    console.log('Conversation Ended Error:', error);
                } else if (continueConversation) {
                    promptForInput();
                } else {
                    console.log('Conversation Complete');
                    conversation.end();
                }
            })
            // catch any errors
            .on('error', (error) => {
                console.log('Conversation Error:', error);
            });
    }

    function promptForInput() {
        var rl = _readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question('Type your request: ', (request) => {
            // start the conversation
            _assistantConfig.conversation.textQuery = request;
            _assistant.start(_assistantConfig.conversation, startConversation);

            rl.close();
        });
    }
})();