'use strict';

const express = require('express');
const request = require('request');
const fs = require('fs');
const db = require('./services.json');
const serversList = require('./serversList.json');

const router = express.Router();

router.get('/services', (req, res) => {
  res.json(db);
});

router.get('/serverslist', (req, res) => {
  res.send(serversList);
});

router.post('/send', (req, res) => {
  sendRequest(req.body, res);
});

router.post('/save', (req, res) => {
  save(req.body, res);
});

function sendRequest(fdata, res) {
  let headers = null;
  if (fdata.headers !== undefined || fdata.headers !== null) {
    headers = fdata.headers.reduce( (headersObj, header) => {
      headersObj[header.key] = header.value;
      return headersObj;
    }, {});
  }
  const options = {
    method: fdata.method,
    url: fdata.url,
    body: fdata.body || null,
    headers: headers,
    time: true
  };
  request(options, (err, response, body) => {
    let _body = '';
    try {
      _body = JSON.parse(body);
    } catch (e) {
      _body = body;
    }
    res.send({
      body: _body || null,
      headers: response.headers || null,
      time: response.elapsedTime || null,
      statusCode: response.statusCode || null
    });
  });
}

function save(data, res) {
  if (data.systemId === null && data.serviceId === null) {
    console.log('New service request');
    // db.findIndex( (system: DB) => system.name.includes(data.name)) > -1 ? newService(data) : newSystem(data);
  } else {
    existingService(data);
  }
  fs.writeFileSync('./server/services.json', JSON.stringify(db, undefined, 4));
  res.send(db);
}

function existingService(data) {
  try {
    db.forEach((system, systemindex) => {
      console.log(system);
      if (system.id.toString() === data.systemId.toString()) {
        const serviceindex = system.services.findIndex(service => service.id.toString() === data.serviceId.toString());
        db[systemindex].id = data.systemId;
        db[systemindex].name = data.systemName;
        db[systemindex].services[serviceindex].id = data.serviceId;
        db[systemindex].services[serviceindex].method = data.method;
        db[systemindex].services[serviceindex].url = data.url;
        db[systemindex].services[serviceindex].headers = data.headers;
        db[systemindex].services[serviceindex].name = data.serviceName;
        db[systemindex].services[serviceindex].sampleRequest = data.sampleRequest;
        db[systemindex].services[serviceindex].sampleResponse = data.sampleResponse;
        db[systemindex].services[serviceindex].description = data.description;
      }
    });
  } catch (e) {
    console.log(e);
  }

}

module.exports = router;
