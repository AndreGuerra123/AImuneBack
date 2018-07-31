const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelSchema = new Schema({

    name: {type: String, required: true},
    user: {type: String, required: true},
    shared: {type: Boolean, required: true},
    date: {type: Date, required: true},
    architecture: {type:Object, required: true},
    dataset: {type:Object,required:false, default: null},
    config: {type:Object, required:false, default: null},
    file: {type:Object,required:false,default:null},
    results: {type:Object, required:false,default:null}

});


modelSchema.index({user:1,name:1},{unique: true}) //make a unique schema in oder to avoid user to create a architecture with the same name.

const Modeler=mongoose.model('model', modelSchema);

module.exports= Modeler;