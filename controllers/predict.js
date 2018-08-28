const Temper = require('../models/predict.js');
const Modeler = require('../models/models.js');
const Loader = require('../models/loader.js');
const Formidable = require('formidable');
const fs = require('fs');
const get = require('lodash/get');
const {Joi} = require('celebrate');


const learningSchema = {
    architecture: Joi.object().required(),
    weights: Joi.object().required(),
    job: Joi.object().required(),
    date: Joi.date().required()
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

module.exports = {

    predictCurrent: async (req,res,next) =>{
        const{user} = req.body
        models = await Modeler.find({$or:[{user:user},{shared:true}]})
        models = models.filter(model => !isLearningError(model)).filter(model => !isLearningRunning(model)).filter(model=>isLearningValid(model))
        return res.status(202).json(models)
    },
    predictLoadTemporary: async (req, res, next) => {

        var form = new Formidable.IncomingForm();

        let path;
        let contentType;

        await form.parse(req, async function (err, fields, files) {
          
            if (err) {

                return res.status(404).json(err);

            } else {

                const {
                    user,
                    patient,
                    condition,
                    compound,
                } = fields;

                path = files.image.path;
                contentType = files.image.type;
                fs.readFile(path, async function (err, data) {

                    if (err) {

                        return res.status(404).json(err);

                    } else {

                        //Save load
                        const newTemp = new Temper({
                            user,
                            patient,
                            condition,
                            compound,
                            image: {
                                data,
                                contentType
                            }
                        });

                        //Delete image in local storage
                        await fs.unlink(path, function (error) {
                            if(error){
                                return res.status(404).json(error);
                            }
                                                            
                        });

                        await newTemp.save();

                        res.status(200).json(newTemp._id);
                    }
                })
            }
        });
    },
    predictTransferTemporary: async (req,res,next) =>{
        const{temp_id,classi} = req.body
        await Temper.findOne({'_id':temp_id},(err,temp)=>{
            if(err) res.status(404).json(err)
            temp.classi = classi
            Loader.insert(temp, (err,load)=>{
                if(err) res.status(404).json(err)
                return res.status(202)
            })
        })

    },
    predictClassTemporary: async (req,res,next) => {

    }
};