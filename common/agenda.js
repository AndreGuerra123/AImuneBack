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


const updateProgress = async function (jobi, value, description) {

    await agenda.jobs({
        "_id": jobi._id
    }, function (err, job) {
        if(!err){
            job.progress = {
                value,
                description
            }
            job.save();    
        }
    });
}

//train the model
agenda.define('train', {
    priority: 'high'
}, (job, done) => {
    let i = 0;
    while (i <= 100) {
        setTimeout(updateProgress(job, i, i), 1000);
    }
    done();
});

//Starting agenda
agenda.on('ready', function () {
    agenda.start();
});

//Exporting agenda
module.exports = agenda;