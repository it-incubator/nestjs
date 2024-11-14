set PORT...



"start:dev": "PORT=3001 nest start --watch",

https://www.npmjs.com/package/cross-env
npm install --save-dev cross-env

https://www.npmjs.com/package/dotenv

require('dotenv').config()

import 'dotenv/config'

приоритет     "start:dev": "cross-env NODE_ENV=development PORT=3002 nest start --watch",
