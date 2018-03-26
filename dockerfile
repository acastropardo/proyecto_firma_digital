FROM ubuntu:16.04
FROM node:carbon

# Create app directory
WORKDIR WORKDIR /usr/src/appFirmaD

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

#JAVA
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y  software-properties-common && \
	apt-get install default-jre -y

EXPOSE 8080
CMD [ "npm", "start" ]
