const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const DIST_FOLDER = path.join(process.cwd(), 'dist');
const app = express();
const PORT = process.env.PORT || 4000;
const router = require('./server/router');

app.set('views', path.join(DIST_FOLDER, 'RESTAPI'));
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html');


app.use(cors());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/server', router);

app.get('*.*', express.static(path.join(DIST_FOLDER, 'RESTAPI')));
app.get('/', (req, res) => {
  res.render(path.join(DIST_FOLDER, 'RESTAPI', 'index.html'))
});

app.listen(PORT, () => {
  console.log(`listning on port : ${PORT}`);
})
