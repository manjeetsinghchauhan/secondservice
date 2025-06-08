FROM node:20-alpine AS appbuild
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install && npm install typescript -g
COPY . .
RUN chown -R node:node /usr/src/app
USER node
RUN cd /usr/src/app && echo $(ls)
#RUN npm run development
RUN tsc
EXPOSE 2000
#ENV ENVIRONMENT="prod"
#CMD NODE_ENV=development npm run start
CMD NODE_ENV=development node ./build/server.js
