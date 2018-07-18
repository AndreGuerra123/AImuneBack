const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loaderSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    patient: {
        type: String,
        required: false
    },
    condition: {
        type: String,
        required: false
    },
    compound: {
        type: String,
        required: false
    },
    class: {
        type: Number,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String,
        required: true
    },
    date_sample:{
        type: Date,
        required: false
    },
    date_acquired: {
        type: Date,
        required: false
    },
    date_uploaded: {
        type: Date,
        require: false
    },
    date_modified: {
        type: Date,
        required: false
    }
});

loaderSchema.pre('save', function(next){
    var now = Date.now();
    this.date_modified = now;
    if ( !this.date_uploaded) {
      this.date_uploaded = now;
    }
    next();
  });

const Loader = mongoose.model('load', loaderSchema);

module.exports = Loader;