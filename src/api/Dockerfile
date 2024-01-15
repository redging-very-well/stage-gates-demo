# Our container is based on node 14, using an alpine linux container.
FROM node:18 as base

# Set our working folder to /working in the container
WORKDIR /working

# Copy our package.json/package-lock.json into the container
COPY package*.json ./
# Now install our dependencies
RUN npm ci

# Copy the rest of our source across.
# We do this separately from our package.json files to take advantage of docker layer caching.
# As a result, we want to put less frequently changing things higher in the dockerfile.
COPY . .
# Run our unit tests
RUN npm test

# Run the 'start' npm task when the container is deployed and started up.
ENTRYPOINT npm start
