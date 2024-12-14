# Use an official Node.js runtime as a parent image
FROM alpine

COPY . /src
# Set the working directory inside the container
WORKDIR /src


# Expose the port the app will run on
EXPOSE 3000

# Use CMD to run the app with npm start
ENTRYPOINT ["node", "app.js"]