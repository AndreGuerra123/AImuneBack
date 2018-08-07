const {
    MONGO
} = require('../config/index.js');
const Agenda = require('agenda');
const Modeler = require('../models/models.js');
const Jobs = require('../models/jobs.js');
var should = require('chai').should();
var get = require('lodash/get');
const axios = require('axios');

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

const getModelParameters = function (source) {
    Modeler.findById(source).select({
        "dataset": 1,
        "config":1,
        "architecture":1
    }).exec((err, model) => {
        if (err) {
            throw new Error('Error retrieving model dataset configuration')
        } else {
            should.exist(get(model, "dataset", null));
            should.exist(get(model, "config", null));
            should.exist(get(model, "architecture", null));
            return model;
        }
    })
}

const 

const validMetrics = [
    "binaryAccuracy",
    "binaryCrossentropy",
    "categoricalAccuracy",
    "categoricalCrossentropy",
    "cosineProximity",
    "meanSquaredError"
];

const validLosses = [
    "binaryAccuracy",
    "binaryCrossentropy",
    "categoricalAccuracy",
    "categoricalCrossentropy",
    "cosineProximity",
    "meanSquaredError"
];

const validOptimisers = [
    "binaryAccuracy",
    "binaryCrossentropy",
    "categoricalAccuracy",
    "categoricalCrossentropy",
    "cosineProximity",
    "meanSquaredError"
];

const isValidMetric = function (e) {
    return validMetrics.contains(e);
}

const isValidLoss = function (e) {
    return validLosses.contains(e);
}

const isValidOptimiser = function (e) {
    return validOptimisers.contains(e);
}

const processedConfig = function (config) {

    var loss = get(config, 'loss', null);
    should.exist(loss);
    loss.should.be.a('string');
    if (!isValidLoss(loss)) throw new Error('Loss function is misconfigured.')

    var optimiser = get(config, 'optimiser', null);
    should.exist(optimiser);
    optimiser.should.be.a('string');
    if (!isValidOptimiser(optimiser)) throw new Error('Optimiser function is misconfigured.')

    var metrics = get(config, 'metrics', null);
    should.exist(metrics);
    metrics.should.be.a('array');

    if (metrics.includes("-1")) {
        config.metrics = validMetrics;
    } else if (!metrics.every(isValidMetric)) {
        throw new Error('Metrics object is misconfigured.')
    }

    var batchsize = get(config, 'batchsize', null);
    should.exist(batchsize);
    batchsize.should.be.a('number');
    (batchsize % 1).should.be.equal(0);

    var epochs = get(config, 'epochs', null);
    should.exist(epochs);
    epochs.should.be.a('number');
    (epochs % 1).should.be.equal(0);

}

const processedDataset = function (dataset) {

}

const processedArchitecture = function (arch) {

    arch.should.be.a('object');

}

const validateModelParameters = function(params){
    processedConfig(params.config);
    processedDataset(params.dataset);
    processedArchitecture(params.architecture);
}
const ax = axios.create({
    baseURL: "http://0.0.0.0:5000/"
  });

const trainingModel = async function(params){

    ax.post("/train",params).then(res =>{return res}).catch(err =>{throw new Error(err)});

}

//train the model
agenda.define('train', (job, done) => {

    //Get necessary parameters
    updateJobProgress(job, 0.05, "Loading model parameters...")
    var source = get(job, 'attrs.data.source', null)
    should.exist(source)
    var params = getModelParameters(source);

    //Validating model parameters
    updateJobProgress(job, 0.2, "Validating model parameters...");
    validateModelParameters(params);

    //Partitioning the dataset
    updateJobProgress(job, 0.3, "Partitioning the dataset...");
    partitioningDataset(params);
    
    //Training
    updateJobProgress(job, 0.4, "Training model in AImunePython...");
    trainingModel(params);

    //Results
    updateJobProgress(job, 0.8, "Returning model results...");
    evaluateResults(params);

    done();

});

//Starting agenda
agenda.on('ready', function () {
    agenda.start();
});

//Exporting agenda
module.exports = agenda;