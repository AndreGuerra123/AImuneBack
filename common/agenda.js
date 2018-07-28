const {MONGO} = require('../config/index.js');
const Agenda = require('agenda');
//Configuring agenda
let agenda = new Agenda({db: {address: MONGO, collection: 'jobs'}});

//Defining agenda jobs
//create configuration of the architecture
agenda.define('config',{priority:'high'},(job,done)=>{
    const params =job.attrs.data;
    console.log(params);
    done();
});
//create the dataset
agenda.define('data',{priority:'high'},(job,done)=>{

});
//train the model
agenda.define('train',{priority:'high'},(job,done)=>{

});

//Starting agenda
agenda.on('ready', function() {agenda.start();});

//Exporting agenda
module.exports = agenda;