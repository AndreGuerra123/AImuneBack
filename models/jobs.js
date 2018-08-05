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

module.exports = mongoose.model('Jobs', jobSchema);

