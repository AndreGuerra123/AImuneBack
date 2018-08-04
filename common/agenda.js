const {MONGO} = require('../config/index.js');
const Agenda = require('agenda');
const Modeler = require('../models/models.js');

//Configuring agenda
let agenda = new Agenda({db: {address: MONGO, collection: 'jobs'}});

//train the model
agenda.define('train',{priority:'high'},(job,done)=>{

    const {source} = job.attrs.data;
    let sync = {
        config_date: null,
        dataset_date: null
    }
    Modeler.findById(source).lean().exec(function (err, oldModel){
        if(err){
            throw new Error(err);
        }else{
            sync.config_date = oldModel.config.date;
            sync.dataset_date = oldModel.dataset.date;
        }
    });

    Modeler.update({"_id":source},{
        $set: {
            sync
        }
    })


});

//Starting agenda
agenda.on('ready', function() {agenda.start();});

//Exporting agenda
module.exports = agenda;