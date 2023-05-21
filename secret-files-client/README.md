# Secret files client

Client for the secret files challenge - by Diego Canuhé

These instructions assume you are positioned in the same directory as this `README.md` file.

---------------------------

## Docker


### Requirements

- A functioning Docker installation with the buildx component (the deprecated
  legacy builder may fail to build the image).


### Setup

Build the image:

```sh
docker build -t <image-name> .
```

where `<image-name>` is an identifier of your choice.

By default, the client will look for the API at `http://localhost:3000`.
Optionally, pass the REACT_APP_API_URL build argument to choose a different location.
If you want to change the api url later, you'll have to rebuild the image.

```sh
docker build -t <image-name> --build-arg REACT_APP_API_URL="http://localhost:9999" .
```


### Test

Run the tests inside a container:

```sh
docker run -it --rm <image-name> npm test
```

where `<image-name>` is the identifier you chose while building the image.


### Run

Run the container:

```sh
docker run -it --rm -p<port>:8080 <image-name>
```

where `<port>` is the port you wish to use to comunicate with the app
and `<image-name>` is the identifier you chose while building the image.

---------------------------

## Manual


### Requirements

- Either
  + Node version `16` + `npm`
  + `nvm`


### Setup

If you are using `nvm`, run:

```sh
nvm install
nvm use
```

If you have Node 16 installed and don't want to use `nvm`, then the previous step is not required.

Install dependencies:

```sh
npm install
```


### Test

Run the tests:

```sh
npm test
```


### Run

Start the server

```sh
npm start
```

Optionally, you can pass the PORT environment variable to choose a
different port.

```sh
PORT=8081 npm start
```

By default, the client will look for the API at `http://localhost:3000`.
Optionally, pass the REACT_APP_API_URL environment variable to choose
a different location.

```sh
REACT_APP_API_URL="http://localhost:3099" npm start
```

---------------------------

## Usage

Go to `http://localhost:<port>`, where `<port>` is the port you chose
to comunicate with the app.
