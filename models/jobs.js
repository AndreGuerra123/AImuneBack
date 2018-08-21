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

const resetJobByModelId = async (modelid) => {

    const model  = await Modeler.findOne({'_id':modelid},{'file.queue':1,'_id':0})
    const jobid  = get(model,'file.queue')
    if(jobid){
        mongoose.connection.db.collection('jobs'),function(err, collection){
            collection.remove({
                '_id':jobid
            })
        }
    }
    await Modeler.findByIdAndUpdate(source,{$set: {file:null,results:null}})


}

const syncJobByModelId = async function (job, modelid) {

    var model = await Modeler.findById(modelid).select({
        "config": 1,
        "dataset": 1
    })

    await Modeler.updateOne({
        _id: modelid
    }, {
        $set: {
            file: {
                queue: job.attrs._id,
                sync: {
                    config_date: get(model, 'config.date', null),
                    dataset_date: get(model, 'dataset.date', null)
                },
                date: new Date()
            }
        }
    })
}

module.exports = {
    findJobById,
    resetJobByModelId,
    syncJobByModelId
}