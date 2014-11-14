FROM node:0.10-onbuild
# replace this with your application's default port
EXPOSE 8080
COPY . /src
RUN mkdir -p /etc/photomap
#COPY ./conf.json /etc/photomap/conf.json