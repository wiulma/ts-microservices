# Sample Backend Service

## Storage Service

[Storage Service](./storage-service/README.md)

## Docker



### Some tricks
1. Using
```
    volumes:
      - ./storage-service:/usr/local/storage-service
      - /usr/local/storage-service/node_modules/
```
let you avoid to copy all node_modules dependency from container to host machine