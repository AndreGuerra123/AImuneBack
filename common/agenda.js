const {
    MONGO
} = require('../config/index.js');
const Agenda = require('agenda');
const axios = require('axios');

const get = require('lodash/get')
const sampleSize = require('lodash/sampleSize')

const mongoose = require('mongoose');
const Modeler = require('../models/models.js');
const Jobs = require('../models/jobs.js');
const Loader = require('../models/loader.js');

const expect = require('chai').expect
const asserttype = require('chai-asserttype');
chai.use(asserttype);



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
const toOBID = function (stringID) {
    return new mongoose.Types.ObjectId(stringID)
}

const ax = axios.create({
    baseURL: "http://0.0.0.0:5000/"
});

const createPartitions = function (dictionary, params) { //TODO: Randomly partition (not weighted)
    const train_partition = sampleSize(dictionary, Math.round(dictionary.length / pp));
    const train_set = new Set(train_partition)
    var test_partition = [...new Set([...partition].filter(x => !train_set.has(x)))];
    params.partitions = {
        train_partition,
        test_partition
    }
}

const loadParameters = function (job) {
    var source = get(job, 'attrs.data.source', null)
    expect(source, 'Original source identifier was not provided.').to.exist;
    var params = Modeler.findById(toOBID(source)).select({
        "dataset": 1,
        "config": 1,
        "architecture": 1,
        "queue": 1
    });
    expect(params, 'Invalid or inexistent model parameters object.').to.exist.and.to.be.an('object')
    return params;
}

const existObj = function (object) {
    expect(object).to.exist.and.to.be.object()
}

const nonEmptyArray = function (object) {
    expect(object).to.exist.and.to.be.array().and.to.not.be.empty;
}

const existBoolean = function (object) {
    expect(object).to.exist.and.to.be.boolean();
}

const validImageInteger = function (object) {
    expect(object).to.be.at.least(25).and.satisfy(Number.isInteger);
}

const validStringInArray = function(object,array){
    expect(object).to.be.string().and.to.be.oneOf(array)
}

const validMetrics = function(metricsarray){

    if(!metricsarray.every(isValidMetric)){
      throw new Error("Some selected metrics are unavailable");
    }

}

const isValidMetric = function(metric){

    return validMetrics.includes(metric);

}

const validIntegerOne = function(object){
    expect(object).to.be.at.least(1).and.to.satisfy(Number.isInteger);
}

const validPercentage = function(object){
    expect(object).to.be.at.least(1).and.to.be.at.most(99);
}

const processingParameters = function (params) {

    //Getting the necessary fields and check their existence;

    var dataset = get(params, 'dataset', null);
    existObj(dataset);

    var config = get(params, 'config', null);
    existObj(config);

    var architecture = get(params, 'architecture', null);
    existObj(architecture);

    var queue = get(params, 'queue', null);
    existObj(queue);

    //Processing dataset;
    nonEmptyArray(get(dataset, 'patients', null));
    nonEmptyArray(get(dataset, 'conditions', null));
    nonEmptyArray(get(dataset, 'compounds', null));
    nonEmptyArray(get(dataset, 'classes', null));
    existBoolean(get(dataset, 'rotate', null));
    existBoolean(get(dataset, 'normalise', null));
    validImageInteger(get(dataset, 'width', null));
    validImageInteger(get(dataset, 'height', null));

    //Processing configuration;
    validStringInArray(get(config, 'loss', null),validLosses);
    validStringInArray(get(config, 'optimiser', null),validOptimisers);

    var metrics = get(config, 'metrics', null);
    if(metrics.includes("-1")){

        config.metrics = validMetrics;

    }else{

        validMetrics(metrics);

    }

    validIntegerOne(get(config,'epochs',null));
    validIntegerOne(get(config, 'batchsize', null));
    validPercentage(get(config,'trainpct',null));

    //Checking architecture;
    existObj(get(config,'architecture',null));

    //Checking for Queue
    existObj(get(config,'queue',null))

    return {
        dataset,
        config,
        architecture,
        queue
    }

}

const createDictionary = function (params) {
    var dataquery = {};
    if (!params.dataset.patients.includes("-1")) {
        query["patients"] = {
            $in: params.dataset.patients
        }
    }
    if (!params.dataset.conditions.includes("-1")) {
        query["conditions"] = {
            $in: params.dataset.conditions
        }
    }
    if (!params.dataset.compounds.includes("-1")) {
        query["compounds"] = {
            $in: params.dataset.compounds
        }
    }
    if (!params.dataset.classes.includes("-1")) {
        query["classes"] = {
            $in: params.dataset.classes
        }
    }
    console.log(dataquery)

    const dictionary = await Loader.find(dataquery).select({
        "patient": 1,
        "condition": 1,
        "compounds": 1,
        "classes": 1
    }).catch((err) => {
        throw new Error(err)
    })


    if (!dictionary || dictionary.length <= 2) {
        throw new Error('Querying image database returned insufficient samples.');
    }

    return dictionary;
}
//train the model
agenda.define('train', (job, done) => {

    //Get necessary parameters
    updateJobProgress(job, 0.2, "Loading model parameters...")
    var pre = loadParameters(job);
    console.log(pre);

    updateJobProgress(job, 0.4, "Validating and processing model parameters...")
    var params = processingParameters(pre);
    console.log(params)

    //Creating Dictionary
    updateJobProgress(job, 0.6, " Creating image dictionary...");
    var dictionary = createDictionary(params)
    console.log(dictionary);

    //Creating Partition
    updateJobProgress(job, 0.8, " Creating dataset partitions...");
    var final = createPartition(dictionary,params);
    console.log(final);

    //Training
    updateJobProgress(job, 1, "Training model in AImunePython...");
    ax.post("/train", final).then(res => {
        return res
    }).catch(err => {
        throw new Error(err)
    });

    done();

});

//Starting agenda
agenda.on('ready', function () {
    agenda.start();
});

//Exporting agenda
module.exports = agenda;