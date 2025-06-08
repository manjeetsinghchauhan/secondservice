# Overview Project
This project is based on micro service  architecture which we find user onboarding process, is built in hapi js framework. Developing web services with hapi allow us to focus on many problems to be solved, not only the details of the tool being used. Hapi provides the right set of core APIs and extensible plugins to support the requirements of a modern access-token management,security, connectivity,and code quality.

## Prerequisite

- ***Redis Server*** - In your system redis server should be up and running
- ***MongoDb*** - In your system MongoDb server >=6.x should be up and running
- ***NodeJs*** - In your system NodeJS >= 18.X should be up and running


- ***Install dependency*** - Run npm install to install all dependency
```
npm install 
```
## Environment 
- ***Setup Environment*** - Create a file in your root folder named .env.local with the following details 

ENVIRONMENT="local"
IP="local"
PORT=4000
ADMIN_PORT=4000
APP_URL="http://localhost:4000"
PROTOCOL="http"
TAG="local"
NODE_ENV="local"

# Mongo DB Credentials mongodb://localhost:27017/
    DB_NAME="homeservice"
    DB_URL="mongodb://localhost:27017/"
    DB_USER=""
    DB_PASSWORD=""
    DB_REPLICA_SET="rs1"
    DB_REPLICA=false
    DB_SSL=false

# Count Limit for OTP
MAX_LOGIN_COUNT=6
MAX_OTP_LIMIT=3
INVALID_OTP_COUNT=2


REDIS_HOST="127.0.0.1"
REDIS_PORT="6379"
REDIS_DB=0

FROM_MAIL="kdhiraj3776@gmail.com"
SENDGRID_API_KEY="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"

MICROSERVICE_URL="secondservice"
VERSION=v1

## Scripts 
```
    "prestart": "tsc",
    "local": " tsc && NODE_ENV=local node ./build/server.js",
    "watch": "tsc --watch",
    "development": "tsc && NODE_ENV=development node ./build/server.js",
    "nodemon": "NODE_ENV=local nodemon --exec ts-node -- server.ts",
    "sc": "node_modules/sonar-scanner/bin/sonar-scanner"
```

## Folder Structure 

```
Folder structure:-
 src
    ├── config
    ├── interfaces
    ├── json
    ├── lib
    │   └── redis
    ├── modules
    │   ├── baseDao
    │   ├── loginHistory
    │   │   └── v1
    │   └── user
    │       └── v1
    ├── plugins
    ├── routes
    ├── uploads
    ├── utils
    └── views
```

## Project run on local machine
```
npm run local 
```

## Documentation
https://docs.google.com/document/d/1ssK_aAM2B9gf9NqN_QfkMwNeMt_1BQIMuU-HqRvOm4E/edit
