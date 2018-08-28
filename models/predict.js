const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tempSchema = new Schema({
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
    image: {
        data: Buffer,
        contentType: String
    },
});

const Temp = mongoose.model('temp', tempSchema);

module.exports = Temp;