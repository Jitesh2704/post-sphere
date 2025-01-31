# Use an official Node runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json from the correct location
COPY services/forums-service/package*.json ./

# Install any needed packages
RUN npm install

# Copy the rest of the app (everything inside forums-service/) into the container
COPY services/forums-service/ ./

# Expose the port the app runs on
EXPOSE 8012

# Define the command to run your app
CMD ["npm", "run", "dev"]



# # Use an official Node runtime as a parent image
# FROM node:20

# # Set the working directory in the container
# WORKDIR /app

# # Copy package.json and package-lock.json (or npm-shrinkwrap.json)
# COPY package*.json ./

# # Install any needed packages
# RUN npm install

# # Bundle app source inside the docker image
# COPY . .

# # Make port available to the world outside this container
# EXPOSE 8012

# # Define the command to run your app
# CMD ["npm","run","dev"]

