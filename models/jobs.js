const mongoose = require('mongoose');


const findJobById = function (jobid, cb) { //cb erro res

    mongoose.connection.db.collection('jobs', function (err, collection) {
        collection.find({
            '_id': jobid
        }).toArray(cb);
    });

}

const updateJobById = function (jobid, set) {
    mongoose.connection.db.collection('jobs', function (err, collection) {
        collection.update({
            '_id': jobid
        }, {
            $set: set
        });
    });
}

module.exports = {
    findJobById,
    updateJobById
}