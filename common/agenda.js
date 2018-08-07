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

const partition = function (whole, pp) { //TODO: Randomly partition (not weighted)
    const train_partition = sampleSize(whole, Math.round(whole.length / pp));
    const train_set = new Set(train_partition)
    var test_partition = [...new Set([...partition].filter(x => !train_set.has(x)))];
    return {
        train_partition,
        test_partition
    }
}

//train the model
agenda.define('train', (job, done) => {

    //Get necessary parameters
    updateJobProgress(job, 0.05, "Loading model parameters...")
    var source = get(job, 'attrs.data.source', null)
    console.log(source);

    let params;
    let partition;

    Modeler.findById(toOBID(source), (err, res) => {
        if (err) {
            throw new Error(err);
        } else {
            console.log(res);
            params = res;
        }
    });


    //Partitioning the dataset
    updateJobProgress(job, 0.1, "Partitioning the dataset...");

    var query = {};
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

    Loader.find(query, 'patient condition, compounds, classes', (err, res) => {
        if (err) {
            throw new Error(err);
        } else {
            partition = res;
        }
    })

    if (!partition || partition.length <= 2) {
        throw new Error('Query to image database returned with empty dataset.');
    } else {
        params.partition = partition;
    }

    //Training
    updateJobProgress(job, 0.2, "Training model in AImunePython...");
    
    ax.post("/train", params).then(res => {
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