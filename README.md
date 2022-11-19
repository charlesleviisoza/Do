# GraphQL API - CRUD

This GraphQL API allows users to:
* Construct complex queries to get episodes, characters and locations
* Create and delete episodes, characters and locations
* Edit locations

## Environment variables

These are the environment variables needed for the project to run correctly:\
**You must fill the information of your MySQL database**

```sh
NODE_ENV="development" # Set to "production" if in production environment
PORT="3000" # Port of the app
LOGGER_LEVEL="debug" # Level of the logger
ROOT_PATH="/api" # Root url of the api
GRAPHQL_UI="TRUE" # Variable that defines if the UI is available
DATABASE_HOST="<host>" # Database's host
DATABASE_USER="<user>" # Database's user
DATABASE_PASSWORD="<password>" # Database's password
DATABASE_NAME="<name>" # Database's name
DATABASE_PORT="3306" # Database's port
DATABASE_SSL="FALSE" # Specifies if the database uses SSL connection
DEPTH_LIMIT="8" # Defines the number of deep levels in the GraphQL queries. Can be left blank
MIGRATE_DATABASE="FALSE" # Defines if the structure of the database must be migrated
```
## Installation

The environment must have [Node JS](https://nodejs.org/en/download/) and the [npm](https://nodejs.org/en/download/) package manager installed.\
Run the following command to install the necessary libraries.

```bash
npm install
```

## Test the project

This is the command to run the unit tests:

```bash
npm test
```

## Starting the project

### Local

This is the command to run the project: 

```bash
npm run dev
```

### Production

This is the command to run the project: 

```bash
npm start
```

This is the successful result: 

```bash
[2022-11-19T10:55:04.725] [INFO] default - Database started
[2022-11-19T10:55:04.729] [INFO] default - HTTP Server listening in port 3000
```

*NOTE:* The first time the project is started, the environment variable *MIGRATE_DATABASE* must be equal to *TRUE*, in order to initialize the structure of the database. Then, you can set the same variable to *FALSE*, so it will not be migrated again.