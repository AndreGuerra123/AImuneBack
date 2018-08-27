//Import Internal Dependencies
const axios = require("axios");
const Modeler = require('../models/models.js');
const Designer = require('../models/design.js')
const Loader = require('../models/loader.js');
const get = require('lodash/get');
const ObjectId = require('mongoose').Types.ObjectId
const axPy = axios.create({
    baseURL: "http://127.0.0.1:5000/",
  });

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

const learningSchema = {
    architecture: Joi.object().required(),
    weights: Joi.object().required(),
    job: Joi.object().required(),
    date: Joi.date().required()
}
const resultsSchema = { 
    results: Joi.object().required()
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

const isLearningUnsync = function (model) {
    dataset_date = get(model,'dataset.date')
    config_date = get(model,'config.date')
    sync_dataset_date = get(model,'file.sync.dataset_date')    
    sync_config_date = get(model,'file.sync.config_date')

    try {
        if (+dataset_date == +sync_dataset_date && +config_date == +sync_config_date) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        return true;
    }

}
const isLearningEmpty = function (model){
    return !(model && get(model,'file'))
}

const isLearningError = function(model){
    if(get(model,'file.job.error')){
        return true
    }else if(isLearningUnsync(model)){
        return true
    }else{
        return false
    } 
}

const isLearningRunning = function(model){
    return (get(model,'file.job.started') && !get(model,'file.job.finished'))
}

const isLearningValid = function(model){
    if (Joi.validate(model, learningSchema)) {
        return true;
    } else {
        return false;
    };
}

const evaluateLearning = function (model) {
    if (isLearningEmpty(model)) {
        return 0;
    } else if (isLearningError(model)) {
        return 2;
    } else if (isLearningRunning(model)) {
        return 1;
    } else if (isLearningValid(model)) {
        return 3;
    } else {
        return 4;
    }
}


const evaluateResults = function (model) {
    if (!get(model,'results')) {
        return 0;
    } else if (validResults(model)) {
        return 3;
    } else {
        return 4;
    }
}

const validResults = function (results) {
    if (Joi.validate(results, resultsSchema)) {
        return true;
    } else {
        return false;
    };
}

const deleteGridFile =  async function(req,res,id){
    if(id){
        const gfs = req.app.get('gfs')
        gfs.remove(id, function (err, gridStore) {
            if (err) return res.status(404).json(err)
        });
    }   
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
        
            const {
                name,
                user,
                shared,
                date,
                archid
            } = req.body;

            const arch = await Designer.findOne({"_id":new ObjectId(archid)})
            const newModel = new Modeler({
                        name,
                        user,
                        shared,
                        date,
                        architecture: arch
                    });

            newModel.save();
            return res.status(200).json({
                        id: newModel.id
                    });

    },
    proceed_status: async (req, res, next) => { //responsible for indicating if the steps are achieved, empty or ongoing
        const source = req.query.source;
        Modeler.findById(source,(err, model) => {
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
              patients,
              conditions,
              compounds,
              classes,
              center,
              normalise,
              width,
              height,
              data_format,
              color_format,
              rescale,
              rounds,
              transform,
              random,
              keep,
              rotation,
              width_shift,
              height_shift,
              shear,
              channel_shift,
              brightness,
              zoom,
              horizontal_flip,
              vertical_flip,
              fill_mode,
              cval,
              date
        } = req.body;

        await Modeler.update({
            _id: source
        }, {
            $set: {
                dataset: {
                    patients,
                    conditions,
                    compounds,
                    classes,
                    center,
                    normalise,
                    width,
                    height,
                    data_format,
                    color_format,
                    rescale,
                    rounds,
                    transform,
                    random,
                    keep,
                    rotation,
                    width_shift,
                    height_shift,
                    shear,
                    channel_shift,
                    brightness,
                    zoom,
                    horizontal_flip,
                    vertical_flip,
                    fill_mode,
                    cval,
                    date: new Date()
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
              epochs,
              batchsize,
              date,
              lr,
              momentum,
              decay,
              nesterov,
              rho,
              epsilon,
              beta1,
              beta2,
              amsgrad,
              shuffle,
              seed,
              validation_split
        } = req.body;


        await Modeler.update({
            _id: source
        }, {
            $set: {
                config: {
                    loss,
                    optimiser,
                    epochs,
                    batchsize,
                    date,
                    lr,
                    momentum,
                    decay,
                    nesterov,
                    rho,
                    epsilon,
                    beta1,
                    beta2,
                    amsgrad,
                    shuffle,
                    seed,
                    validation_split,
                    date: new Date()
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
    proceed_learning_current: async (req, res, next) => {

        const source = req.query.source;
        await Modeler.findById(source,{'file.job':1,'_id':0},(err, model)=>{
            if(err){
                return res.status(404).json(err)
            }else{
                return res.status(202).json(get(model,'file.job'))
            }

        })

    },
    proceed_learning_start: async (req, res, next) => { 
        axPy.post('/train',{source:req.body.source}).catch(err=>{})
        return res.status(202)
    },
    proceed_learning_reset: async (req, res, next) => {
        const model = await Modeler.findOne({'_id':req.body.source},{'weights':1,'results':1})
        const rid = get(model,'results')
        const wid = get(model,'weights')

        await deleteGridFile(req,res,rid)
        await deleteGridFile(req,res,wid)    

        await Modeler.updateOne({'_id':req.body.source},{$set:{
            'file':null,
            'results':null,
            'weights':null
        }}).catch(err=>{
            return res.status(404).json(err)
        })

    },
    proceed_results: async (req, res, next) => {
        axPy.post('/results',{source:req.body.source}).then(resi =>{
            return res.status(202).json(resi.data)
        }).catch(err=>{
            return res.status(404).json(err)
        })
    },


};