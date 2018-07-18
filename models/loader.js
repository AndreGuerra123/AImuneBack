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
    classi: {
        type: Number,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    mime: {
        type: String,
        required: true
    }
});

const Loader = mongoose.model('load', loaderSchema);

module.exports = Loader;