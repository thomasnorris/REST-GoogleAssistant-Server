## Prerequisites
### Notice
- As of `11/19/2019`, this will not work on an __ARMv6__ device (such as a RPi Zero W). This will work on an __ARMv7__ device such as the Raspberry Pi 3B.
    - See [this](https://github.com/grpc/grpc/issues/13258) and [this](https://github.com/mapbox/node-pre-gyp/issues/348).
### NPM and Node.js
- Both of these are required and can be downloaded [here](https://github.com/nodesource/distributions).
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