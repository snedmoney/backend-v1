FROM postgres:12

WORKDIR /app

ENV POSTGRES_USER=dev
ENV POSTGRES_PASSWORD=JkP%7NqgGGj8TGJz
ENV POSTGRES_DB=postgres
ENV POSTGRES_HOST_AUTH_METHOD=trust

COPY ./src/scripts/init.sh /docker-entrypoint-initdb.d
COPY ./src/scripts/SEED.sql ./scripts/SEED.sql