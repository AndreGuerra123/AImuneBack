//Import Internal Dependencies
const Modeler = require('../models/models.js');
const Loader = require('../models/loader.js');
const agenda = require('../common/agenda.js');

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
            console.log(err);
            return res.status(404).json(err);
        }

    },
    proceed_status: async (req, res, next) => { //responsible for indicating if the steps are achieved, empty or ongoing
                
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
        let patients_opts,conditions_opts,compounds_opts,classes_opts;
        await Loader.distinct("patient",{user},(err,array)=>{
            if(err){
                return res.status(404).send(err)
            }else{
                patients_opts = array;
            }
        })
        await Loader.distinct("condition",{user},(err,array)=>{
            if(err){
                return res.status(404).send(err)
            }else{
                conditions_opts = array;
            }
        })
        await Loader.distinct("compound",{user},(err,array)=>{
            if(err){
                return res.status(404).send(err)
            }else{
                compounds_opts = array;
            }
        })
        await Loader.distinct("classi",{user},(err,array)=>{
            if(err){
                return res.status(404).send(err)
            }else{
                classes_opts = array;
            }
        })

        res.status(200).json({patients_opts,compounds_opts,conditions_opts,classes_opts})
        next();
    },
    proceed_dataset_update: async (req, res, next) => { //update the dataset in this model
        const{source, rotate, normalise, patients, conditions, compounds, classes, width, height} = req.body;
        await Modeler.update({_id:source},{$set:{dataset: {rotate, normalise,patients,conditions,compounds,classes,width,height}}},(err,model)=>{
            if(err){
                return res.status(404).json(err);
            }else{
                return res.status(202).json("Updated dataset configuration.")
            }
        })
    },
    proceed_config: async (req, res, next) => {

    },
    proceed_learning: async (req, res, next) => {

    },
    proceed_results: async (req, res, next) => {

    },
    

};