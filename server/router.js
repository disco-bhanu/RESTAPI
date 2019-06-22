'use strict';

const express = require('express');
const request = require('request');
const fs = require('fs');
let db = require('./services.json');
const serversList = require('./serversList.json');
const path = require('path');

const router = express.Router();

router.get('/services', (req, res) => {
  res.json(db);
});

router.get('/servers', (req, res) => {
  res.send(serversList);
});

router.post('/send', (req, res) => {
  sendRequest(req.body, res);
});

router.post('/save', (req, res) => {
  save(req.body, res);
});

router.post('/add-server', (req, res) => {
  addServer(req.body, res);
});

router.post('/delete-server', (req, res) => {
  deleteServer(req.body, res);
});

router.get('/export', (req, res) => {
  res.sendFile(path.join(__dirname, 'services.json'))
});

router.post('/import', (req, res) => {
  importRequest(req.body, res);
});

router.post('/delete', (req, res) => {
  deleteRequest(req.body, res);
});

function sendRequest(form, res) {
  let headers = null;
  if (form.headers !== undefined || form.headers !== null) {
    headers = form.headers.reduce( (headersObj, header) => {
      headersObj[header.key] = header.value;
      return headersObj;
    }, {});
  }
  const options = {
    method: form.method,
    url: form.url,
    body: form.body || null,
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
    if(!err) {
      res.send({
        body: _body || null,
        headers: response.headers || null,
        time: response.elapsedTime || null,
        statusCode: response.statusCode || null
      });
    } else {
      console.log(err);
      res.json({ error: err});
    }
  });
}

function save(data, res) {
  if(db.some(s => s.name === data.systemName) && data.systemId === null) {
    let systemIdx = db.findIndex( s => s.name === data.systemName);
    db[systemIdx].services.push({
      name: data.serviceName,
      description: data.description || null,
      method: data.method,
      url: data.url,
      headers: data.headers,
      sampleRequest: data.body,
      sampleResponse: data.response
    });
  } else if (data.systemId === null) {
    let newSystem = { name: '', services: []};
    newSystem.name = data.systemName;
    newSystem.services.push({
      name: data.serviceName,
      description: data.description,
      method: data.method,
      url: data.url,
      headers: data.headers,
      sampleRequest: data.body,
      sampleResponse: data.response
    });
    db.push(newSystem);
    console.log('New service request');
  } else if(data.serviceId === null) {
    db[data.systemId].services.push({
      name: data.serviceName,
      description: data.description || null,
      method: data.method,
      url: data.url,
      headers: data.headers,
      sampleRequest: data.body,
      sampleResponse: data.response
    });
  } else {
    console.log(data);
    db[data.systemId].name = data.systemName;
    db[data.systemId].services[data.serviceId].name = data.serviceName;
    db[data.systemId].services[data.serviceId].description = data.description;
    db[data.systemId].services[data.serviceId].method = data.method;
    db[data.systemId].services[data.serviceId].url = data.url;
    db[data.systemId].services[data.serviceId].headers = data.headers;
    db[data.systemId].services[data.serviceId].sampleRequest = data.body;
    db[data.systemId].services[data.serviceId].sampleResponse = data.response;
  }
  fs.writeFileSync(path.join(__dirname, 'services.json'), JSON.stringify(db, undefined, 4));
  res.send(db);
}

function deleteRequest(ids, res) {
  let tempDB = db.slice();
  ids.reverse().forEach( id => {
    let systemIdx = id.split('_')[0];
    let serviceIdx = id.split('_')[1];
    tempDB[systemIdx].services.splice(serviceIdx, 1);
  });
  tempDB = tempDB.filter(item => item.services.length > 0);
  fs.writeFileSync(path.join(__dirname, 'services.json'), JSON.stringify(tempDB, undefined, 4));
  res.json(tempDB);
}

function importRequest(file, res) {
  let isGood = true;
  if(Array.isArray(file)) {
    file.forEach(sys => {
      if(sys.hasOwnProperty('name') && sys.hasOwnProperty('services')) {
        if(Array.isArray(sys.services)) {
          sys.services.forEach( srv => {
            if(!srv.hasOwnProperty('name') && !srv.hasOwnProperty('url') && !srv.hasOwnProperty('method')) {
              isGood = false;
            }
          })
        } else {
          isGood = false;
        }
      } else {
        isGood = false;
      }
    })
  } else {
    isGood = false;
  }
  if(isGood === false) {
    res.status('422').send();
  } else {
    db = [...db, ...file];
    fs.writeFileSync(path.join(__dirname, 'services.json'), JSON.stringify(db, undefined, 4));
    res.json(db);
  }
}

function addServer(server, res) {
  serversList.push(server.name);
  fs.writeFileSync(path.join(__dirname, 'serversList.json'), JSON.stringify(serversList, undefined, 4));
  res.json(serversList);
}

function deleteServer(index, res) {
  serversList.splice(index, 1);
  fs.writeFileSync(path.join(__dirname, 'serversList.json'), JSON.stringify(serversList, undefined, 4));
  res.json(serversList);
}

module.exports = router;
