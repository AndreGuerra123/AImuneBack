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

    const jobid  = await Modeler.find({'_id':modelid},{'file.queue':1,'_id':0})
    console.log(jobid)
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