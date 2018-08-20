const mongoose = require('mongoose');
const Modeler = require('./models.js')
const get = require('lodash/get')


const findJobById = function (jobid, cb) { //cb erro res

    mongoose.connection.db.collection('jobs', function (err, collection) {
        collection.find({
            '_id': jobid
        }).toArray(cb);
    });

}

const removeJobByModelID = async (modelid) => {

    const model  = await Modeler.findOne({'_id':modelid},{'file.queue':1,'_id':0})
    const jobid  = get(model,'file.queue')
    if(jobid){
        mongoose.connection.db.collection('jobs'),function(err, collection){
            collection.remove({
                '_id':jobid
            })
        }
    }

}

module.exports = {
    findJobById,
    removeJobByModelID,
}