# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application to the Docker image
COPY . .

# The application listens on port 3000, so let's expose it
EXPOSE 3333

RUN npx prisma generate

RUN npm install -g nodemon

# Run the following command when the container starts
CMD ["npm", "run", "dev"]