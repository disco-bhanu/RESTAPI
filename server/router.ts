import { Router } from 'express';
import * as request from 'request';
import * as fs from 'fs';
import { DB } from './db.model';

import { default as db } from './services.json';

export const router = Router();

router.get('/services', (req, res) => {
  res.json(db);
});

router.post('/save', (req, res) => {
  save(req.body, res);
});

router.post('/delete', (req, res) => {
  deleteService(req.body, res);
});

router.post('/send', (req, res) => {
  sendRequest(req.body, res);
});

function save(data, res) {
  if (data.systemId === null) {
    console.log('New service request');
    db.findIndex( (system: DB) => system.name.includes(data.name)) > -1 ? newService(data) : newSystem(data);
  } else {
    existingService(data);
  }
  fs.writeFileSync('./server/services.json', JSON.stringify(db, undefined, 4));
  res.send(db);
}

function newSystem(data) {
  db.push({
    id: db.length + 1,
    name: data.systemName,
    services: [{
      id: 1,
      name: data.serviceName,
      description: data.description,
      url: data.url,
      method: data.method,
      headers: data.headers,
      sampleRequest: data.sampleRequest,
      sampkeResponse: data.sampleResponse
    }]
  });
}

function newService(data) {
  const systemindex = db.findIndex( (system: DB) => system.name === data.name);
  db[systemindex].services.push({
    id: data.serviceId,
    name: data.serviceName,
    description: data.description,
    url: data.url,
    method: data.method,
    headers: data.headers,
    sampleRequest: data.sampleRequest,
    sampleResponse: data.sampleResponse
  });
}

function existingService(data) {
  try {
    db.forEach((system: DB, systemindex) => {
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

function deleteService(req, res) {
  const id = req.id;
  const systemId = id.split('_')[0];
  const serviceId = id.split('_')[1];
  const systemindex = db.findIndex( system => system.id.toString() === systemId.toString());
  const serviceindex = db[systemindex].services.findIndex( service => service.id.toString() === serviceId.toString());
  db[systemindex].services.splice(serviceindex, 1);
  fs.writeFileSync('./server/services.json', JSON.stringify(db, undefined, 4));
  res.send(db);
}

function sendRequest(fdata, res) {
  const headers = {};

  Object.keys(fdata.headers).forEach(header => {
    headers[header] = fdata.headers[header];
  });

  const options = {
    method: fdata.method,
    url: fdata.url,
    headers: headers,
    time: true
  };

  request(options, (err, response, body) => {
    const resp = {
      body: JSON.parse(body),
      time: response.elapsedTime,
      statusCode: response.statusCode
    };
    res.send(resp);
  });
}
