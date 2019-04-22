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
  } else {
    existingService(data);
  }
  console.log(db[0]);
  fs.writeFileSync(path.join(__dirname, 'services.json'), JSON.stringify(db, undefined, 4));
  res.send(db);
}

function existingService(data) {
  console.log(data);
  try {
    db[data.systemId].name = data.systemName;
    db[data.systemId].services[data.serviceId].name = data.serviceName;
    db[data.systemId].services[data.serviceId].description = data.description;
    db[data.systemId].services[data.serviceId].method = data.method;
    db[data.systemId].services[data.serviceId].url = data.url;
    db[data.systemId].services[data.serviceId].headers = data.headers;
    db[data.systemId].services[data.serviceId].sampleRequest = data.sampleRequest;
    db[data.systemId].services[data.serviceId].sampleResponse = data.sampleResponse;
  } catch (e) {
    console.log(e);
  }

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

module.exports = router;
