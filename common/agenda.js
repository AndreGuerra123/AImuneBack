const {
    MONGO
} = require('../config/index.js');
const Agenda = require('agenda');
const Modeler = require('../models/models.js');
const Jobs = require('../models/jobs.js');

//Configuring agenda
let agenda = new Agenda({
    db: {
        address: MONGO,
        collection: 'jobs'
    }
});


const updateJobProgress = function (job, value, description) {

    Jobs.updateJobById(job._id, {
        progress: {
            value,
            description
        }
    })

}

//train the model
agenda.define('train', (job, done) => {


    updateJobProgress(job, 50, "half way there...")

    done();

});

//Starting agenda
agenda.on('ready', function () {
    agenda.start();
});

//Exporting agenda
module.exports = agenda;