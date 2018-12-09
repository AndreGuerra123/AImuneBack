const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


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
    classi: {
        type: Number,
        required: true
    },
    shared: {
        type: Boolean,
        required: true
    },
    image: {
        type: ObjectId,
        required:true
    },

});

const Loader = mongoose.model('load', loaderSchema);

module.exports = Loader;