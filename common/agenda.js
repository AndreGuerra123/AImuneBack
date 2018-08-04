const {
    MONGO
} = require('../config/index.js');
const Agenda = require('agenda');
const Modeler = require('../models/models.js');

//Configuring agenda
let agenda = new Agenda({
    db: {
        address: MONGO,
        collection: 'jobs'
    }
});


const updateJobProgress = async function (job, value, description) {

            job.progress = {
                value,
                description
            }
            job.save();    
        
}

//train the model
agenda.define('train', {
    priority: 'high'
}, (job, done) => {
    let i = 0;
    while (i <= 100) {
        setTimeout(updateJobProgress(job, i, i), 1000);
    }
    done();
});

//Starting agenda
agenda.on('ready', function () {
    agenda.start();
});

//Exporting agenda
module.exports = agenda;