const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Jobs = mongoose.model("Jobs", new Schema({}),"jobs",true);
module.exports= Jobs;