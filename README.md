# Sample mDS Web App

Sample app to control mbed endpoints through mDS/Connector.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/bridadan/meetup-sample-web-app)

## Editing Instructions

To get this project to work, edit the following lines in app.js:

```
var mds_credentials = {
  username: 'webapp0',
  password: 'iotmeetup2015'
};

var app_url = 'http://iot-hack-mds.cloudapp.net:3000';
```

Change `username` to the username given to you as instructed.
Leave `password` as-is.
Change `app_url` to the URL at which your app has been deployed on Heroku.

## Install and Run

In the root of the cloned folder, run:

```
npm install
node app.js
```
