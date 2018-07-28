FROM node:carbon

ENV NODE_ENV production
ENV PORT 3000

WORKDIR /usr/src/app

COPY . .

# Setup server
WORKDIR /usr/src/app/server
RUN npm install --production

# Setup backoffice
WORKDIR /usr/src/app/server/backoffice/public
RUN npm install bower -g
RUN bower install --allow-root

# Configuring runtime
WORKDIR /usr/src/app/server

EXPOSE ${PORT}

CMD npm start