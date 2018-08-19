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


const ax = axios.create({
    baseURL: "http://localhost:5000/"
});

const ann = function(obj,loc,msg){

    const toreturn = get(obj,loc,null)
    expect(toreturn,msg).to.exist;
    return toreturn

}

agenda.define('train', (job, done) => {

    const params = {}
    params.model_id = ann(job, 'attrs.data.source', "Failed to retrieve model id.").toString()
    params.job_id = ann(job, 'attrs._id', "Failed to retrieve job id.").toString()

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