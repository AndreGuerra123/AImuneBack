const {MONGO} = require('../config/index.js');
const Agenda = require('agenda');
const Modeler = require('../models/models.js');

//Configuring agenda
let agenda = new Agenda({db: {address: MONGO, collection: 'jobs'}});


const updateProgress = async function(job, value, description){
    await agenda.update({"_id":job._id},
        {
            $set: {
                progress:{
                    value,
                    description
                }
            }
        }
    )
}

//train the model
agenda.define('train',{priority:'high'},(job,done)=>{
   let i = 0;
   while(i<=100){
    setTimeout(updateProgress(job,i,i),1000);
   }
   done();
});

//Starting agenda
agenda.on('ready', function() {agenda.start();});

//Exporting agenda
module.exports = agenda;