const {MONGO} = require('../config/index.js');
const Agenda = require('agenda');
//Configuring agenda
let agenda = new Agenda({db: {address: MONGO, collection: 'jobs'}});

//train the model
agenda.define('train',{priority:'high'},(job,done)=>{

});

//Starting agenda
agenda.on('ready', function() {agenda.start();});

//Exporting agenda
module.exports = agenda;