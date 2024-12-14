# Use the official Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy all project files into the container
COPY . .

# Install dependencies
RUN npm install

# Expose the port the app will run on
EXPOSE 3000

# Use CMD to run the app
CMD ["npm", "start"]
