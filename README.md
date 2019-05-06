# Sample Backend Service

Sample Typescript backend service, docker based.

## Architecture
Docker compose starts 3 services:
- backend api service (storage-service)
- database (Postgresql)
- Database client (PGAdmin)

## Microservices
1. [Storage Service](./storage-service/README.md)

## How to run
1. Docker environment
2. Local environment

### Docker
From console, run
```
docker-compose up
```

### Locally
Setup local environment

#### Install database
1. Install locally postgres
2. create a user:
uid: sample
pwd: sample-pwd


#### Setup backend
1. install node >= 10.15
2. open console and run
    ```
    npm i
    ```

#### Init example data
After first boot, goto postgres admin console and execute:
db/init.sql

example users:
```
user: admin
pwd: admin
```
```
user: user
pwd: user
```

#### Run backend
1. Run in developer mode
    ```
    npm run start
    ```

    3.1 Debug Code
    
        After start, goto  vscode debug view, and launch "Attach to storage-service"

2. Run tests
    ```
    npm run test
    ```

3. Build
    ```
    npm run build
    ```

4. Generate docs

    Open console and run
    ```
    npm run generate-apidoc
    ```

### How to test

#### Postman
Install Postman and use provided collection in ./postman/sample.storage-service.json

#### Swagger ui
Launch docker (or backend locally) and go to:
```
http://localhost:8005/apidoc/
```

### Some docker tricks
1. Using
```
    volumes:
      - ./storage-service:/usr/local/storage-service
      - /usr/local/storage-service/node_modules/
```
let you avoid to copy all node_modules dependency from container to host machine