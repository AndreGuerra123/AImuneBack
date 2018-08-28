const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tempSchema = new Schema({
    image: {
        data: Buffer,
        contentType: String,
        required:true
    }
});

const Temp = mongoose.model('temp', tempSchema);

module.exports = Temp;