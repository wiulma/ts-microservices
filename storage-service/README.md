# Storage Service
Storage Service

## Before running
1. Install locally postgres
2. create a user:
uid: sample
pwd: sample-pwd


## How it works
1. install node >= 10.15
2. open console and run
    ```
    npm i
    ```

3. Run in develoepr mode
    ```
    npm run start
    ```

    3.1 Debug Code
    
        After start, goto  vscode debug view, and launch "Attach to storage-service"

4. Run tests
    ```
    npm run test
    ```

5. Build
    ```
    npm run build
    ```

6. Generate docs

    Open console and run
    ```
    npm run generate-apidoc
    ```

## Init example data
After first boot, goto postgres admin coneold and execute:
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

## Create PostgreSQL dump
1. Go to
```
C:\Program Files\PostgreSQL\10\bin>
```
2. run
```
.\pg_dump -U postgres -W -F p sample > sample.sql
```

## FROM:
https://medium.com/javascript-in-plain-english/creating-a-rest-api-with-jwt-authentication-and-role-based-authorization-using-typescript-fbfa3cab22a4

## Swagger Docs
In order to view and test apis, you can use swagger docs
```
http://localhost:8005/apidoc/
```