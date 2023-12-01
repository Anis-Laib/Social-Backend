# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application to the Docker image
COPY . .

# The application listens on port 3000, so let's expose it
EXPOSE 3333

RUN npm run build

RUN npm run start