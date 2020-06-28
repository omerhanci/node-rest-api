FROM node:carbon

ENV user node
# RUN if [ "x$user" = "node" ] ; then echo Skipping user creation; else groupadd -r $user && useradd -r -g $user $user ; fi
# RUN groupadd -r $user && useradd -r -g $user $user

# Create app directory
RUN mkdir -p /$user/src/app
WORKDIR /$user/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./package*.json ./
# COPY ./bower.json ./

# RUN npm install
# If you are building your code for production
RUN npm install --only=production

# install bower
# RUN npm install --global bower
# RUN bower install --allow-root

COPY ./docker-entrypoint.sh /$user/src/app

# Bundle app source
COPY ./ .

RUN chown -R $user:$user /$user/src/app/

USER $user

RUN chmod +x /$user/src/app/docker-entrypoint.sh

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# default to port 80 for node
ARG PORT=8080
ENV PORT $PORT
EXPOSE $PORT

# check every 30s to ensure this service returns HTTP 200
# HEALTHCHECK CMD curl -fs http://localhost:$PORT/sihhatinyerindemi || exit 1

ENTRYPOINT ["/node/src/app/docker-entrypoint.sh"]

CMD [ "npm", "start" ]