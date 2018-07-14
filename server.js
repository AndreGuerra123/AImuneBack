var express = require('express');
var fs = require('fs');
var https = require('https');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

const {PORT} = require('./config/index.js');

//TO SET THE SERVER CORRECTLY
//sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/apache-selfsigned.key -out /etc/ssl/certs/apache-selfsigned.crt
//ufw allow from  fontend-ip to any port 3000
//node server.js

const credentials = {
    key: fs.readFileSync('/etc/ssl/private/aimuneback.key'),
    cert: fs.readFileSync('/etc/ssl/certs/aimuneback.cert')
  }


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
var httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, function () {
    console.log('AImune app listening on port '+PORT.toString()+'! Go to https://aimune.science:3000/')
  });


