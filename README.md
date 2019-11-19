## Prerequisites
### NPM and Node.js
- Both of these are required and can be downloaded [here](https://github.com/nodesource/distributions).
    - If using a Raspberry Pi Zero W, follow [these](https://www.thepolyglotdeveloper.com/2018/03/install-nodejs-raspberry-pi-zero-w-nodesource/) instructions instead.
### Geeni
- Geeni is connected to the Google Assistant.
- The cameras are named the same as in `program.js`.
    - This can be done through the Google Home app or the Geeni app.
### Google Assistant
- Follow [these](https://developers.google.com/assistant/sdk/guides/service/python/embed/config-dev-project-and-account) instructions to configure a Google Developer Project.
    - Do not download credentials from the OAuth2 Consent screen.
- Follow [these](https://developers.google.com/assistant/sdk/guides/service/python/embed/register-device)
 instructions to register the device model.
    - Anything can be used for the *model settings*.
    - No *traits* need to be specified.
    - Download __OAuth 2.0__ credentials when prompted and rename to `client_secret.json`.
## Installation
- Everything in the __Prerequisites__ section must be done first!
- After cloning:
    - Place `client_secret.json` downloaded earlier in the root of this repository.
    - Run `npm install` to install packages.
    - Run `node program.js` to start.
- Optionally, add the following line to `/etc/rc.local` for auto startup:
    - `sudo node "/PATH/TO/REPO/program.js"`.