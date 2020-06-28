FROM node:carbon

ENV user node

# Create app directory
RUN mkdir -p /$user/src/app
WORKDIR /$user/src/app

COPY ./package*.json ./

RUN npm install --only=production

COPY ./docker-entrypoint.sh /$user/src/app

# Bundle app source
COPY ./ .

RUN chown -R $user:$user /$user/src/app/

USER $user

RUN chmod +x /$user/src/app/docker-entrypoint.sh

# default to port 80 for node
ARG PORT=8080
ENV PORT $PORT
EXPOSE $PORT

ENTRYPOINT ["/node/src/app/docker-entrypoint.sh"]

CMD [ "npm", "start" ]