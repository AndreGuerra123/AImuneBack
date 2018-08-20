const mongoose = require('mongoose');
const Modeler = require('./models.js')


const findJobById = function (jobid, cb) { //cb erro res

    mongoose.connection.db.collection('jobs', function (err, collection) {
        collection.find({
            '_id': jobid
        }).toArray(cb);
    });

}

const removeJobByModelID = async (modelid) => {

    const model  = await Modeler.find({'_id':modelid},{'file.queue':1})
    const jobid =  model.file.queue
    if(jobid){
        mongoose.connection.db.collection('jobs'),function(err, collection){
            collection.remove({
                '_id':jobid
            })
        }
    }

}

const removeJobByID = async (jobid) => {

    mongoose.connection.db.collection('jobs'),function(err, collection){
            collection.remove({
                '_id':jobid
            })
        }
    
}


module.exports = {
    findJobById,
    removeJobByModelID,
    removeJobByID
}