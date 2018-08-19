const mongoose = require('mongoose');


const findJobById = function (jobid, cb) { //cb erro res

    mongoose.connection.db.collection('jobs', function (err, collection) {
        collection.find({
            '_id': jobid
        }).toArray(cb);
    });

}

module.exports = {
    findJobById,
    updateJobById
}