const mongoose = require('mongoose')
const {MONGO} = require('../config/index.js');
mongoose.connect(MONGO);

var gridfs = require('mongoose-gridfs')({
  collection:'fs',
  model:'File',
  mongooseConnection: mongoose.connection
})
var FileSchema = gridfs.schema;
 
module.export = mongoose.model('File', FileSchema);
