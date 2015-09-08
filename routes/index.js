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

var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
  var endpointController = req.app.get('endpointController'),
      endpoints = endpointController.getEndpoints();
  
  return res.render("index", {
    endpoints: endpoints
  });
});

router.post("/", function(req, res, next) {
  var endpointController = req.app.get('endpointController'),
      endpoint_name = req.body['endpoint-name'],
      resource_uri = req.body['resource-uri'],
      resource_value = req.body['resource-value'];

  endpointController.writeResourceValue(endpoint_name, resource_uri, resource_value, function(success) {  
    var endpoints = endpointController.getEndpoints();

    return res.render("index", {
      endpoints: endpoints
    });
  });
});

router.put("/webhook", function(req, res, next) {
  console.log('/webhook hit');
  console.log(req.body);

  var endpointController = req.app.get('endpointController');

  if (req.body.notifications) {
    endpointController.handleNotifications(req.body.notifications);
  }
  
  res.sendStatus(200);
});

module.exports = router;
