var express = require('express');
var fs = require('fs');
var https = require('https');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

const vars = require('./config/index.js');


//MongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/authentication');
//Express
var app = express();

//Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());

//Routes
app.use('/', require('./routes/users'));

//Start server
https.createServer({
    key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
    cert: fs.readFileSync(path.resolve(__dirname, 'server.cert'))
  }, app)
  .listen(vars.PORT, function () {
    console.log('AImune app listening on port 3000! Go to https://aimune.science:3000/')
  })

