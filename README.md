## Description

TBD.

## Setup

Install packages.

```
$ npm install
```

## Commands

### Locally (Development)

Copy the `example.env` to `.env`

```shell script
cp example.env .env
```

Run the `docker-compose.yml` to init the infrastructure services:

```shell script
docker-compose up
```

```shell script
# Server
npm run start:dev
```

### Live

```shell script
# Server
npm run start
```

### Building & Releasing

First, compile the application:

```shell script
npm run build
```

This will create a directory with optimized JS files under `dist`.

Run the application under production via:

```shell script
$ npm run start
```
