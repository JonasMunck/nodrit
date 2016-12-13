FROM node:7

ADD package.json /src/package.json
WORKDIR /src
RUN npm install

ADD . /src


EXPOSE 5001

cmd ["node", "app.js"]
