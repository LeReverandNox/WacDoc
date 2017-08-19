FROM node:8.4

RUN npm install -g bower

RUN mkdir /src
RUN chown -R node:node /src
WORKDIR /src

USER node

ADD src/package.json /src
ADD src/bower.json /src
ADD src/.bowerrc /src

RUN npm install
RUN bower install

ADD src /src
ADD files /

EXPOSE 3000

USER root
ENTRYPOINT ["sh", "/entrypoint.sh", "npm", "run", "start", "--"]