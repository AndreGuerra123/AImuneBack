const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const designerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    shared: {
        type: Boolean,
        required: true
    },
    file: {
        type: Object,
        required: true
    }
});

designerSchema.index({user:1,name:1},{unique: true}) //make a unique schema in oder to avoid user to create a architecture with the same name.

const Designer = mongoose.model('architecture', designerSchema);

module.exports = Designer;