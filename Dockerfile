# Specify the official docker image for the latest long term support (LTS) release. 
# Use a specific version, rather than node:latest, so avoid risking an accidental upgrades
FROM dlsimg/node-14.15.0-sass-webpack

# TODO - Need to be moved into dls image
RUN apk update && \
    apk add curl jq py-pip && \
    pip install awscli

#Build Arguments & defaults
ARG PORT=5000
ARG SERVICE_NAME=default

# These variables will be filled by AWS CODEBUILD
ARG APP_ENVIRONMENT
ARG STATIC_ASSETS_ACCESS_KEY_ID
ARG STATIC_ASSETS_SECRET_ACCESS_KEY
ARG STATIC_ASSETS_BASEPATH
ARG DLS_ENV
ARG DLS_ACCOUNT_ID
ARG AWS_REGION
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_DSN
ARG STATIC_ASSETS_AWS_BUCKET
ARG DLS_REALM

#Environment vars
ENV STARTUP=server/index.js

# Replace this with your application's default port
EXPOSE $PORT

# Create an unprivileged user,called dls, to run the app inside the container. If you don’t do this, then the container will run as
# root, security principles. 
# Install a more recent version of NPM, get npm has improvement a lot recently. Again, specify an exact version to avoid 
#accidental upgrades.
RUN adduser -D -u 1001 comprodls

# Setup $HOME
ENV HOME=/home/comprodls

WORKDIR $HOME/$SERVICE_NAME
RUN chown -R comprodls:comprodls $HOME/*

# Copy application source files on the host
COPY . $HOME/$SERVICE_NAME

# Run npm install including any other "posinstall" actions
RUN npm cache clean --force && npm install && npm run build:prod

# Change user and working directory
RUN chown -R comprodls:comprodls $HOME/*
USER comprodls

# Bypass the package.json's start command and bake it directly into the image itself. This reduces the number of processes
# running inside of your container
# Secondly it causes exit signals such as SIGTERM and SIGINT to be received by the Node.js process instead of npm swallowing them.
CMD ["sh", "./run-app.sh"]