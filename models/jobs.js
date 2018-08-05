const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    failedReason: String,
    lastFinishedAt: Date,
    lastRunAt: Date,
    progress: Object
}, {
    collection: 'jobs'
});

const Jobs = mongoose.model('job', jobSchema);

module.exports={
    Jobs
}