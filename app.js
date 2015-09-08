/*
 * Copyright (c) 2013-2015, ARM Limited, All Rights Reserved
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();
var http = require('http').Server(app);
var urljoin = require('url-join');

var MbedConnector = require('mbed-connector');
var EndpointController = require('./controllers/endpoint');

/*
START EDITS
*/

var mds_credentials = {
  username: 'webapp0',
  password: 'iotmeetup2015'
};

var app_url = 'http://iot-hack-mds.cloudapp.net:3000';

/*
END EDITS
*/

var mds_host = 'http://iot-hack-mds.cloudapp.net:8080';
var mds_domain = 'iotmeetup';
var app_port = 3000;

http.listen(app_port, function(){
  console.log('listening on port', app_port);
});


var mbedConnector = new MbedConnector(mds_host, mds_credentials);
var endpointController = new EndpointController(mbedConnector, mds_domain);

app.set('endpointController', endpointController);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


function createWebhook() {
  var url = urljoin(app_url, 'webhook');
  mbedConnector.createWebhook(mds_domain, url, function(error, response, body) {
    if (error || (response && response.statusCode >= 400)) {
      console.error('Webhook registration failed.');
    } else {
      registerPreSubscription();
    }
  });
}

function registerPreSubscription() {
  var preSubscriptionData = [
    {
      "endpoint-name": "light-and-potentiometer",
      "resource-path": ["/LightSensor/0/L"]
    }
  ];

  mbedConnector.registerPreSubscription(mds_domain, preSubscriptionData, function(error, response, body) {
    if (error || (response && response.statusCode >= 400)) {
      console.error('Pre-subscription registration failed.');
    } else {
      endpointController.fetchEndpoints();
    }
  });  
}

createWebhook();

module.exports = {
    app: app
};
