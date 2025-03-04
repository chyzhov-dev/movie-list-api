<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript  repository.

## Project setup

```bash
$ npm install
```

## Fill in the .env file
```dotenv
DB_HOST=localhost
DB_PORT=14306
DB_USER=user
DB_PASSWORD=user
DB_NAME=movies-db

JWT_SECRET=supersecret
JWT_EXPIRES_IN=1d

APP_PORT=3001
STORAGE_UPLOADS=uploads
```

## Database setup
```bash
docker-compose up 
```



## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


## Swagger  

api documentation available at http://localhost:3001/api
