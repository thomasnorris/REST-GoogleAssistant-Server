## Installation
- Follow [these](https://developers.google.com/assistant/sdk/guides/service/python/embed/config-dev-project-and-account) instructions to configure a Developer Project.
    - Do not download credentials from the OAuth2 Consent screen.
- Follow [these](https://developers.google.com/assistant/sdk/guides/service/python/embed/register-device)
 instructions to register the device model.
    - Anything can be used for the model settings.
    - No traits need to be specified.
    - Download __OAuth 2.0__ credentials when prompted. Rename to `client_secret.json` and place in the root directory.
- Run `program.js` from the command line.
    - If `client_tokens.json` does not exist, a browser window will open and a token will be generated. This token will be saved into `client_tokens.json`, so this step only happens once.