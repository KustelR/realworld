# ![RealWorld Example App](logo.png)

> ### [YOUR_FRAMEWORK] codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.


### [Demo](https://demo.realworld.build/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)


This codebase was created to demonstrate a fully fledged fullstack application built with **[YOUR_FRAMEWORK]** including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the **[YOUR_FRAMEWORK]** community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.


# How it works

Frontend done with Next.js, using SSR for front page, articles and if possible in other places
Backend runs on FastAPI and MongoDB

# Getting started

## Docker
TODO: Create docker image

## Front-end

1. [install node and npm](https://nodejs.org/en/download)
2. open "web" directory
3. run ```bash npm install to install``` dependencies
4. run ```bash npm run build``` & npm run start (```bash npm run dev``` if you want dev mode)
5. create here .env and set ```env NEXT_PUBLIC_API_URL``` to your api url (see how to host it below)

Now frontend run on 3000 port

## Back-end

1. [install mongodb](https://www.mongodb.com/docs/manual/installation/) ([docker image](https://hub.docker.com/r/mongodb/mongodb-community-server))
2. [install fastapi](https://fastapi.tiangolo.com/#installation)
3. open "api" directory
4. create here .env file and set ```env MONGODB_CONNECTION_STRING``` to your mongodb connection string (like ```url mongodb://localhost:27017```)
5. run ```bash fastapi run``` (```bash fastapi dev``` if you want dev mode)
6.
7. Now backend runs on 8000 port
