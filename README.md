# Secret files

Secret files challenge - by Diego Canuhé

These instructions assume you are positioned in the same directory as this `README.md` file.

---------------------------

## Docker compose


### Requirements

- A functioning Docker installation with the buildx component (the deprecated
  legacy builder may fail to build the image).
- `docker-compose`


### Run


```sh
docker compose up
```

By default, the API will be available from port 3000 and the client from port 8080
Optionally, pass the API_PORT and/or the CLIENT_PORT environment variables to choose
different ports.

```sh
CLIENT_PORT=8099 API_PORT=3066 docker-compose up
```

If you want to change the api port later, you'll have to rebuild the image.

```sh
API_PORT=3111 docker-compose build
```


### Test

- API: see `secret-files-api/README.md`.
- Client: see `secret-files-client/README.md`.

---------------------------

## Manual

- API: see `secret-files-api/README.md`.
- Client: see `secret-files-client/README.md`.

---------------------------

## Usage

### API

The API includes it own documentation.
Go to `http://localhost:<api-port>/docs`, where `<api-port>` is the port you chose
to comunicate with the app, to find out more.

### Client 

Go to `http://localhost:<client-port>`, where `<client-port>` is the port you chose
to comunicate with the client.
