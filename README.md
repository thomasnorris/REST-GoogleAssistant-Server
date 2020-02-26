## Notice
- As of `11/19/2019`, this __will not__ work on an __ARMv6__ device (such as a RPi Zero W). This __will__ work on an __ARMv7__ device such as the Raspberry Pi 3B.
    - See [this](https://github.com/grpc/grpc/issues/13258) and [this](https://github.com/mapbox/node-pre-gyp/issues/348) for more info.

## Prerequisites
### NPM and Node.js
- Both of these are required and can be downloaded [here](https://github.com/nodesource/distributions) (if not already installed).
### Google Assistant Developer Project
- Follow [these](https://developers.google.com/assistant/sdk/guides/service/python/embed/config-dev-project-and-account) instructions to configure a Google Developer Project.
    - __Do not__ download credentials from the OAuth2 Consen screen.
- Follow [these](https://developers.google.com/assistant/sdk/guides/service/python/embed/register-device)
 instructions to register the device model:
    - Anything can be used for the *model settings*.
    - Select required *traits*.
    - Download __OAuth 2.0__ credentials when prompted and rename to `client_secret.json`. This will be needed later.
## Installation
- Everything in the __Prerequisites__ section must be completed.
- It is recommended clone to a Windows machine first to generate the `client_tokens.json` file.
    - This will be generated upon first run of the program.
    - Once it is generated, copy it into the __config__ folder.
- Clone the repository with `git clone --recurse-submodules` to update submodules.
- After cloning to the target device (Windows or otherwise):
    - Follow the [Node-Logger readme](https://github.com/thomasnorris/Node-Logger) for instructions on setting up the logger.
    - In the `root config` folder:
        - Place `client_secret.json` (downloaded earlier) here.
        - Copy/rename `config_template.json` to `config.json`
            - Enter a desired auth key/value pair. Requests __must__ use this key/value pair as a header to send requests.
            - Enter the matching device model parameters.
        - This folder should now contain:
            - `client_secret.json`
            - `client_tokens.json`
            - `config.json`
    - In the `root` directory:
        - Run `npm install` to install packages.
            - Also run `npm rebuild` if instructed to do so.
        - Run `node program.js` to start.
- Optionally, add the following line to `/etc/rc.local` for auto startup:
    - `sudo node "/PATH/TO/REPO/program.js"`.

## Client Submodule
- View the submodule and instructions for use [here](https://github.com/thomasnorris/REST-GoogleAssistant-Client).
