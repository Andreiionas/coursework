# Use the official Node.js image as a base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /src

# Copy package.json and package-lock.json first to install dependencies separately
COPY package*.json ./

# Install dependencies, including bcrypt
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Start the app using npm start
CMD ["npm", "start"]
