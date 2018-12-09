var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
const {
  errors
} = require('celebrate');

const gridform = require('gridform')
const easyGridFS = require('easy-gridfs')

const {
  MONGO,
  PORT
} = require('./config/index.js');

//Express
var app = express();

//MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(MONGO);

//Setting the GRIDFS drivers
var conn = mongoose.connection;
conn.once('open', function () {
  gridform.mongo = mongoose.mongo;
  gridform.db = conn.db;
  app.set('gridform', gridform);
  app.set('egfs', new easyGridFS(conn.db, mongoose.mongo))
});

//Middleware
app.use(morgan('dev'));
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));
app.use(errors())

//Allowing cors from all sources
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": true,
  "optionsSuccessStatus": 204
}));

//Routes
app.use('/', require('./routes/routes.js'));


app.listen(PORT, function () {
  console.log('AImuneBackend listening on port:' + PORT.toString() + '.')
});

//To run server:
//node server.js