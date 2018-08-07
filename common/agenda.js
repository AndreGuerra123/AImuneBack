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

const validateModelParameters = function(params){

    //Configuration
    var loss = get(params, 'config.loss', null);
    should.exist(loss);
    loss.should.be.a('string');
    if (!isValidLoss(loss)) throw new Error('Loss function is misconfigured.')

    var optimiser = get(params, 'config.optimiser', null);
    should.exist(optimiser);
    optimiser.should.be.a('string');
    if (!isValidOptimiser(optimiser)) throw new Error('Optimiser function is misconfigured.')

    var metrics = get(params, 'config.metrics', null);
    should.exist(metrics);
    metrics.should.be.a('array');

    if (metrics.includes("-1")) {
        params.config.metrics = validMetrics;
    } else if (!metrics.every(isValidMetric)) {
        throw new Error('Metrics object is misconfigured.')
    }

    var batchsize = get(params, 'config.batchsize', null);
    should.exist(batchsize);
    batchsize.should.be.a('number');
    (batchsize % 1).should.be.equal(0);

    var epochs = get(params, 'config.epochs', null);
    should.exist(epochs);
    epochs.should.be.a('number');
    (epochs % 1).should.be.equal(0);
    
    //Dataset
    var rotate = get(params, 'dataset.rotate', null);
    should.exist(rotate);
    rotate.should.be.a('boolean');

    var normalise = get(params, 'dataset.normalise', null);
    should.exist(normalise);
    normalise.should.be.a('boolean');

    var patients = get(params, 'dataset.patients', null);
    should.exist(patients);
    patients.should.be.a('array');

    if (patients.includes("-1")) {
        params.dataset.patients = false;
    }

    var conditions = get(params, 'dataset.conditions', null);
    should.exist(conditions);
    conditions.should.be.a('array');

    if (conditions.includes("-1")) {
        params.dataset.conditions = false;
    }

    var compounds = get(params, 'dataset.compounds', null);
    should.exist(compounds);
    compounds.should.be.a('array');

    if (compounds.includes("-1")) {
        params.dataset.compounds = false;
    }

    var classes = get(params, 'dataset.classes', null);
    should.exist(classes);
    classes.should.be.a('array');

    if (classes.includes("-1")) {
        params.dataset.classes = false;
    }else if(classes.length < 2){
        throw new Error('Insufficient classes associated with labels');
    }

    //Architecture
    var arch = get(params,'config.architecture',null);
    arch.should.be.a('object');
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