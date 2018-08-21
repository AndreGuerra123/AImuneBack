const {
    MONGO
} = require('../config/index.js');
const Agenda = require('agenda');
const axios = require('axios');

const get = require('lodash/get')
const expect = require('chai').expect


//Configuring agenda
let agenda = new Agenda({
    db: {
        address: MONGO,
        collection: 'jobs'
    }
});


const ax = axios.create({
    baseURL: "http://localhost:5000/"
});

const ann = async function(obj,loc,msg){

    const toreturn = get(obj,loc,null)
    expect(toreturn,msg).to.exist;
    return toreturn

}

agenda.define('train', async (job, done) => {

    model_id = await ann(job, 'attrs.data.source', "Failed to retrieve model id.").toString(),
    job_id = await ann(job, 'attrs._id', "Failed to retrieve job id.").toString()
    
    await ax.post("/train", {model_id,job_id}).then(res => {
        done();
    }).catch(err => {
        throw new Error(err)
    });

});

//Starting agenda
agenda.on('ready', function () {
    agenda.start();
});

//Exporting agenda
module.exports = agenda;