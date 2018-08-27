const mongoose = require('mongoose')
var gridfs = require('mongoose-gridfs')({
  collection:'fs',
  model:'File',
  mongooseConnection: mongoose.connection
})
var FileSchema = gridfs.schema;
 
module.export = mongoose.model('File', FileSchema);
