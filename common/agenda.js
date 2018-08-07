const {
    MONGO
} = require('../config/index.js');
const Agenda = require('agenda');
const Jobs = require('../models/jobs.js');
const axios = require('axios');
const get = require('lodash/get')
const Modeler = require('../models/models.js');

//Configuring agenda
let agenda = new Agenda({
    db: {
        address: MONGO,
        collection: 'jobs'
    }
});

const updateJobProgress = function (job, value, description) {

    Jobs.updateJobById(job.attrs._id, {
        progress: {
            value,
            description
        }
    })

}
const toOBID = function(stringID){
    return new mongoose.Types.ObjectId(stringID)
}

const ax = axios.create({
    baseURL: "http://0.0.0.0:5000/"
  });

const trainingModel = function(params){

    ax.post("/train",params).then(res =>{return res}).catch(err =>{throw new Error(err)});

}

//train the model
agenda.define('train', (job, done) => {

    //Get necessary parameters
    updateJobProgress(job, 0.05, "Loading model parameters...")
    var source = get(job, 'attrs.data.source', null)
    console.log(source);

    let params;

    Modeler.findById(toOBID(source),(err,res)=>{
        console.log(err)
        console.log(res)
        params = res;

    })


    //Partitioning the dataset
    updateJobProgress(job, 0.1, "Partitioning the dataset...");
    //partitioningDataset(params);
    
    //Training
    updateJobProgress(job, 0.2, "Training model in AImunePython...");
    trainingModel(params);

    //Results
    updateJobProgress(job, 0.8, "Returning model results...");
    //evaluateResults(params);

    done();

});

//Starting agenda
agenda.on('ready', function () {
    agenda.start();
});

//Exporting agenda
module.exports = agenda;