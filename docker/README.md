# Docker Setup

This directory contains the Dockerfile for building the `web` and `server` applications.

## Building the Images

To build the Docker images, you can use the `docker-compose.yml` file in the root of the project.

```bash
docker compose build
```

This will build the `web` and `server` images in parallel.

## Running the Services

To run the services, you can use the following command:

```bash
docker compose up
```

This will start the `postgres`, `server`, and `web` services.

## How it Works

The `docker/Dockerfile` is a multi-stage Dockerfile that is parameterized to build either the `web` or `server` application. The `docker-compose.yml` file uses this Dockerfile to build the services, specifying the `APP_NAME` and `target` build arguments.

The `APP_NAME` argument can be either `web` or `server`, and it is used to prune the monorepo to only include the dependencies for the specified application.

The `target` argument can be either `runner-web` or `runner-server`, and it is used to select the correct runner stage for the application.
