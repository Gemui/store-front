## Store Front

End point application to manage store front

## Requirements

Node.js >= 12.13.0

Create database user

`CREATE USER full_stack_user WITH password 'Password123'`

Create databases

`CREATE DATABASE store_front;`

`CREATE DATABASE store_front_test;` for testing only

Grand Privileges to user;

`GRANT ALL PRIVILEGES ON DATABASE store_front TO full_stack_user;`

`GRANT ALL PRIVILEGES ON DATABASE store_front_test TO full_stack_user;`

Database port `5432` you can change it from .env 

## Installation

* `yarn` to install dependencies
* `yarn db-up ` to migrate database schema
* Copy `.env.example `to `.env` and set database connection information
* `yarn build` to build the app

## Start Server

```shell
node ./dist/server.js
```

### Endpoint Base Url

Port : `3000`

URL : `http://localhost:3000/api`

#### Test

```shell
yarn test
```
