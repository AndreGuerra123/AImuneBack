const {
    MONGO
} = require('../config/index.js');
const Agenda = require('agenda');
const axios = require('axios');

//Configuring agenda
let agenda = new Agenda({
    db: {
        address: MONGO,
        collection: 'jobs'
    }
});

const ax = axios.create({
    baseURL: "http://0.0.0.0:5000/"
});

//train the model
agenda.define('train', (job, done) => {

    const params = {
       model_id: job.attrs.data.source,
       job_id: job.attrs._id
    }

    ax.post("/train", params).then(res => {
        return res
    }).catch(err => {
        throw new Error(err)
    });

    done();

});

agenda.define('predict',(job,done)=>{
    const params = {}
})

//Starting agenda
agenda.on('ready', function () {
    agenda.start();
});

//Exporting agenda
module.exports = agenda;