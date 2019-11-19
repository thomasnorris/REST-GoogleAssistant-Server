## Notice
- As of `11/19/2019`, this __will not__ work on an __ARMv6__ device (such as a RPi Zero W). This __will__ work on an __ARMv7__ device such as the Raspberry Pi 3B.
    - See [this](https://github.com/grpc/grpc/issues/13258) and [this](https://github.com/mapbox/node-pre-gyp/issues/348) for more info.

## Prerequisites
### NPM and Node.js
- Both of these are required and can be downloaded [here](https://github.com/nodesource/distributions) (if not already installed).
### Google Assistant
- Follow [these](https://developers.google.com/assistant/sdk/guides/service/python/embed/config-dev-project-and-account) instructions to configure a Google Developer Project.
    - __Do not__ download credentials from the OAuth2 Consen screen.
- Follow [these](https://developers.google.com/assistant/sdk/guides/service/python/embed/register-device)
 instructions to register the device model:
    - Anything can be used for the *model settings*.
    - No *traits* need to be specified.
    - Download __OAuth 2.0__ credentials when prompted and rename to `client_secret.json`. This will be needed later.
## Installation
- Everything in the __Prerequisites__ section must be done first!
- After cloning:
    - In the `config` folder:
        - Place `client_secret.json` (downloaded earlier) here.
        - Copy/rename `auth_template.json` to `auth.json` and enter a desired auth key/value pair. Requests __must__ use this key/value pair as a header to send requests.
    - In the `root` directory:
        - Run `npm install` to install packages.
            - Also run `npm rebuild` if instructed to do so.
        - Run `node program.js` to start.
- Optionally, add the following line to `/etc/rc.local` for auto startup:
    - `sudo node "/PATH/TO/REPO/program.js"`.