var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//MongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:6612/authentication');
//Express
var app = express();

//Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());

//Routes
app.use('users', require('./routes/users'));

//Start server
const port = process.env.PORT || 3000;
app.listen(port);
console.log(`AImune Backend API is running in ${port}`);