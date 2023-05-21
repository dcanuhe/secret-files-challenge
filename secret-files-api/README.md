# Secret files API

API for the secret files challenge - by Diego Canuhé

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


### Test

Run the tests inside a container:

```sh
docker run -it --rm <image-name> npm test
```

where `<image-name>` is the identifier you chose while building the image.


### Run

Run the container:

```sh
docker run -it --rm -p<port>:3000 <image-name>
```

where `<port>` is the port you wish to use to comunicate with the app
and `<image-name>` is the identifier you chose while building the image.

---------------------------

## Manual


### Requirements

- Either
  + Node version `14` + `npm`
  + `nvm`


### Setup

If you are using `nvm`, run:

```sh
nvm install
nvm use
```

If you have Node 14 installed and don't want to use `nvm`, then the previous step is not required.

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
PORT=3030 npm start
```

---------------------------

## Usage

The API includes it own documentation.
Go to `http://localhost:<port>/docs`, where `<port>` is the port you chose
to comunicate with the app, to find out more.
