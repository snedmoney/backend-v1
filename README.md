# Setting up PostgreSQL Database with Docker

To run PostgreSQL database server in a Docker container, follow these steps:

## Create a PostgreSQL Container

Use the following command to create a PostgreSQL container:

```bash
docker build -t sned-db .
```

## Start the PostgreSQL Container

Use the following command to start the PostgreSQL container (port is `5431:5432` not `5432:5432`):

```bash
docker run -d -p 5431:5432 sned-db 
```