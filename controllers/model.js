//Import Internal Dependencies
const Modeler = require('../models/models.js');
const Loader = require('../models/loader.js');
const agenda = require('../common/agenda.js');

const {
    Joi
} = require('celebrate');

const datasetSchema = {
    width: Joi.number().min(50).required(),
    height: Joi.number().min(50).required(),
    rotate: Joi.boolean().required(),
    normalise: Joi.boolean().required(),
    patients: Joi.array().required(),
    conditions: Joi.array().required(),
    compounds: Joi.array().required(),
    classes: Joi.array().required(),
    date: Joi.date().required()
}

const configSchema = {
    loss: Joi.string().required(),
    optimiser: Joi.string().required(),
    metrics: Joi.array().required(),
    batchsize: Joi.number().min(1).required(),
    epochs: Joi.number().min(1).required(),
    date: Joi.date().required()
}

const learningSchema = { //TODO: Check if allows for binary
    h5: Joi.binary().required(),
}
const resultsSchema = { //TODO: Later

}


const evaluateStatus = function (model) {
    var status = [];
    status.push(evaluateDataset(model));
    status.push(evaluateConfig(model));
    status.push(evaluateLearning(model));
    status.push(evaluateResults(model));
    return status;
}

const evaluateDataset = function (model) {
    if (!model.dataset) {
        return 0;
    } else if (validDataset(model.dataset)) {
        return 3;
    } else {
        return 4;
    }
}

const validDataset = function (dataset) {
    return Joi.validate(dataset, datasetSchema);
}

const evaluateConfig = function (model) {
    if (!model.config) {
        return 0;
    } else if (validConfig(model.config)) {
        return 3;
    } else {
        return 4;
    }
}

const validConfig = function (config) {
    if (Joi.validate(config, configSchema)) {
        return true;
    } else {
        return false;
    };
}

const evaluateLearning = function (model) { //TODO:
    if (!model.file) {
        return 0;
    } else if (model.file.queue) {
        return 1;
    } else if (model.file.error) {
        return 2;
    } else if (validLearning(model.file)) {
        return 3;
    } else {
        return 4;
    }
}

const validLearning = function (model) {
    if (Joi.validate(model.file, learningSchema)) {
        return true;
    } else {
        return false;
    };
}

const evaluateResults = function (model) {
    if (!model.results) {
        return 0;
    } else if (model.results.queue) {
        return 1;
    } else if (model.results.error) {
        return 2;
    } else if (validResults(model.results)) {
        return 3;
    } else {
        return 4;
    }
}

const validResults = function () {
    if (Joi.validate(model.results, resultsSchema)) {
        return true;
    } else {
        return false;
    };
}

module.exports = {

    init: async (req, res, next) => {

        const user = req.query.user;


        await Modeler.find().or([{
                user: user
            }, {
                shared: true
            }]).select({
                "id": 1,
                "name": 1,
                "user": 1,
                "shared": 1,
                "date": 1,
                "architecture.name": 1,
                "architecture.user": 1

            })
            .then(docs => {
                return res.status(200).json(docs)
            })
            .catch(err => {
                return res.status(404).json(err)
            });
        next();

    },

    delete: async (req, res, next) => {

        const user = req.query.user;
        const name = req.query.name;

        await Modeler.findOneAndRemove({
            user,
            name
        }, function (err, model) {
            if (err) {
                return res.status(404).json(err);
            } else {
                return res.status(200).json("Delete was sucessfull.")
            }
        })

        next();
    },

    clone: async (req, res, next) => {

        const {
            user,
            name,
            source
        } = req.body;

        await Modeler.findById(source).lean().exec(function (err, oldModel) {
            if (err) {
                return res.status(404)
            } else {

                delete oldModel._id;
                oldModel.user = user;
                oldModel.name = name;

                const newModel = Modeler(oldModel);
                newModel.save(function (error) {
                    if (error) {
                        return res.status(400).json(error)
                    }
                });
                return res.status(200).json(newModel._id)
            }
        });
    },
    new: async (req, res, next) => {
        try {
            const {
                name,
                user,
                shared,
                date,
                architecture
            } = req.body;

            const newModel = new Modeler({
                name,
                user,
                shared,
                date,
                architecture
            });

            await newModel.save();
            return res.status(200).json({
                id: newModel.id
            });
        } catch (err) {
            return res.status(404).json(err);
        }

    },
    proceed_status: async (req, res, next) => { //responsible for indicating if the steps are achieved, empty or ongoing
        const source = req.query.source;

        Modeler.findById(source, (err, model) => {
            if (err) {
                return res.status(404).json(err);
            } else {
                try {
                    return res.status(202).json(evaluateStatus(model));
                } catch (error) {
                    return res.status(404).json(error);
                }
            }
        })
    },
    proceed_dataset_current: async (req, res, next) => { //get the current dataset configurations
        const source = req.query.source;
        await Modeler.findById(source).lean().exec(function (err, oldModel) {
            if (err) {
                return res.status(404).json(err)
            } else {
                return res.status(200).json(oldModel.dataset);
            }
        });

    },
    proceed_dataset_options: async (req, res, next) => { //get the user valid options for future selection
        const user = req.query.user;
        let patients_opts, conditions_opts, compounds_opts, classes_opts;
        await Loader.distinct("patient", {
            user
        }, (err, array) => {
            if (err) {
                return res.status(404).send(err)
            } else {
                patients_opts = array;
            }
        })
        await Loader.distinct("condition", {
            user
        }, (err, array) => {
            if (err) {
                return res.status(404).send(err)
            } else {
                conditions_opts = array;
            }
        })
        await Loader.distinct("compound", {
            user
        }, (err, array) => {
            if (err) {
                return res.status(404).send(err)
            } else {
                compounds_opts = array;
            }
        })
        await Loader.distinct("classi", {
            user
        }, (err, array) => {
            if (err) {
                return res.status(404).send(err)
            } else {
                classes_opts = array;
            }
        })

        res.status(200).json({
            patients_opts,
            compounds_opts,
            conditions_opts,
            classes_opts
        })
        next();
    },
    proceed_dataset_update: async (req, res, next) => { //update the dataset in this model
        const {
            source,
            rotate,
            normalise,
            patients,
            conditions,
            compounds,
            classes,
            width,
            height
        } = req.body;

        var date = Date.now();

        await Modeler.update({
            _id: source
        }, {
            $set: {
                dataset: {
                    rotate,
                    normalise,
                    patients,
                    conditions,
                    compounds,
                    classes,
                    width,
                    height,
                    date
                }
            }
        }, (err, model) => {
            if (err) {
                return res.status(404).json(err);
            } else {
                return res.status(202).json("Updated dataset configuration.")
            }
        })
    },
    proceed_config_current: async (req, res, next) => {
        const source = req.query.source;
        await Modeler.findById(source).lean().exec(function (err, oldModel) {
            if (err) {
                return res.status(404).json(err)
            } else {
                return res.status(200).json(oldModel.config);
            }
        });

    },
    proceed_config_update: async (req, res, next) => {
        const {
            source,
            loss,
            optimiser,
            metrics,
            batchsize,
            epochs,
        } = req.body;
        
        var date = Date.now();

        await Modeler.update({
            _id: source
        }, {
            $set: {
                config: {
                    loss,
                    optimiser,
                    metrics,
                    batchsize,
                    epochs,
                    date
                },
            }
        }, (err, model) => {
            if (err) {
                return res.status(404).json(err);
            } else {
                return res.status(202).json("Updated dataset configuration.")
            }
        })
    },
    proceed_learning_current: async(req,res,next)=>{

    },
    proceed_learning_start: async (req, res, next) => {
        try {
            const {
                source
            } = req.body.query; //Gets which model to train
            const job = await agenda.now('train', {
                source
            })
            await Modeler.update({
                _id: source
            }, {
                $set: {
                    file: {
                        queue: job._id
                    }
                }
            })
            return res.status(200); //Starts new training job.
        } catch (error) {
            return res.status(404).json(err);
        }
    },
    proceed_learning_cancel: async (req, res, next) => {

    },
    proceed_results: async (req, res, next) => {

    },


};