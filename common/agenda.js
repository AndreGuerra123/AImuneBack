const {
    MONGO
} = require('../config/index.js');
const Agenda = require('agenda');
const Modeler = require('../models/models.js');
const Jobs = require('../models/jobs.js');
var should = require('chai').should();
var get = require('lodash/get');
import * as tf from '@tensorlowjs/tfjs';


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

}

const validateModelParameters = function(params){
    processedConfig(params.config);
    processedDataset(params.dataset);
    processedArchitecture(params.architecture);
}

//train the model
agenda.define('train', (job, done) => {

    //Get necessary parameters
    updateJobProgress(job, 0.05, "Loading and checking necessary parameters...")
    var source = get(job, 'attrs.data.source', null)
    should.exist(source)

    //Get Config config
    updateJobProgress(job, 0.1, "Loading model parameters...");
    var params = getModelParameters(source);

    //Validating model parameters
    updateJobProgress(job, 0.2, "Validating model parameters...");
    validateModelParameters(params);

    updateJobProgress(job, 0.1, "Resolving the dataset...");

    
    //Compiling
    updateJobProgress(job, 0.2, "Compiling the model architecture...");
    var model = arch.compile({
        optimizer: config.optimiser,
        loss: config.loss,
        metrics: config.metrics
    });

    updateJobProgress(job, 0.3, "Training the model architecture...");
    //Training

    // How many examples the model should "see" before making a parameter update.
    const BATCH_SIZE = config.batchsize;
    // How many batches to train the model for.
    const TRAIN_BATCHES = config.epochs;

    // Every TEST_ITERATION_FREQUENCY batches, test accuracy over TEST_BATCH_SIZE examples.
    // Ideally, we'd compute accuracy over the whole test set, but for performance
    // reasons we'll use a subset.
    const TEST_BATCH_SIZE = config.testbatchsize;
    const TEST_ITERATION_FREQUENCY = config.testepochs;

    for (let i = 0; i < TRAIN_BATCHES; i++) {
        const batch = data.nextTrainBatch(BATCH_SIZE);

        let testBatch;
        let validationData;
        // Every few batches test the accuracy of the mode.
        if (i % TEST_ITERATION_FREQUENCY === 0) {
            testBatch = data.nextTestBatch(TEST_BATCH_SIZE);
            validationData = [
                testBatch.xs.reshape([TEST_BATCH_SIZE, 28, 28, 1]), testBatch.labels
            ];
        }

        // The entire dataset doesn't fit into memory so we call fit repeatedly
        // with batches.
        const history = await model.fit(
            batch.xs.reshape([BATCH_SIZE, 28, 28, 1]),
            batch.labels, {
                batchSize: BATCH_SIZE,
                validationData,
                epochs: 1
            });

        const loss = history.history.loss[0];
        const accuracy = history.history.acc[0];


    }














    done();

});

//Starting agenda
agenda.on('ready', function () {
    agenda.start();
});

//Exporting agenda
module.exports = agenda;