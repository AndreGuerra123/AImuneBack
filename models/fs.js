const mongoose = require('mongoose')
const gridfs = require('mongoose-gridfs')

var gridfs = require('mongoose-gridfs')({
  collection:'fs',
  model:'File',
  mongooseConnection: mongoose.connection
})
var FileSchema = gridfs.schema;
 
module.export = mongoose.model('File', FileSchema);
