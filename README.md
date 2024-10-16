# Setting up PostgreSQL Database with Docker

To run PostgreSQL database server in a Docker container, follow these steps:

## Create a PostgreSQL Container

Use the following command to create a PostgreSQL container:

```bash
docker run --name sned_db -e POSTGRES_PASSWORD=JkP%7NqgGGj8TGJz -p 5432:5432 -d postgres
```

## Start the PostgreSQL Container

Use the following command to start the PostgreSQL container:

```bash
docker container start sned_db
```
