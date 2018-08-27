const {Joi} = require('celebrate');
const {
    INVITE_TOKEN
} = require('../config/index.js')

const maxdate = new Date();
maxdate.setFullYear(maxdate.getFullYear() - 18);

module.exports = {
    schemas: {
        signUp: {
            body: Joi.object().keys({
                firstname: Joi.string().required(),
                lastname: Joi.string().required(),
                birthdate: Joi.date().max(maxdate).required(),
                username: Joi.string().alphanum().min(3).max(30).required(),
                address: Joi.string().required(),
                postalcode: Joi.string().required(),
                city: Joi.string().required(),
                country: Joi.string().required(),
                telephone: Joi.number().required(),
                email: Joi.string().email().required(),
                password: Joi.string().required(),
                password_confirm: Joi.string().valid(Joi.ref('password')).required().options({
                    language: {
                        string: {
                            allowOnly: 'Passwords don\'t match.'
                        }
                    }
                }),
                auth_token: Joi.string().valid(INVITE_TOKEN).required().options({
                    language: {
                        string: {
                            allowOnly: 'Invalid invitation token.'
                        }
                    }
                })
            })
        },
        logIn: {
            body: Joi.object().keys({
                username: Joi.string().required(),
                password: Joi.string().required()
            })
        },
        designInit: {
            query: Joi.object().keys({
                user: Joi.string().required(),
            })
        },
        designSaveNew: {
            body: Joi.object().keys({
                name: Joi.string().required(),
                user: Joi.string().required(),
                date: Joi.date().required(),
                shared: Joi.boolean().required(),
                file: Joi.object().required()
            })
        },
        designSaveOld: { 
            body: Joi.object().keys({
                name: Joi.string().required(),
                user: Joi.string().required(),
                date: Joi.date().required(),
                shared: Joi.boolean().required(),
                file: Joi.object().required()
            })
        },
        designDelete: {
            query: Joi.object().keys({
                name: Joi.string().required(),
                user: Joi.string().required()
            })
        },
        modelInit: {
            query: Joi.object().keys({
                user: Joi.string().required(),
            })
        },
        modelDelete: {
            query: Joi.object().keys({
                name: Joi.string().required(),
                user: Joi.string().required()
            })
        },
        modelClone: { 
            body: Joi.object().keys({
                user: Joi.string().required(),
                name: Joi.string().required(),
                source: Joi.string().required()
            })
        },
        modelNew: { 
            body: Joi.object().keys({
                name: Joi.string().required(),
                user: Joi.string().required(),
                shared: Joi.boolean().required(),
                date: Joi.date().required(),
                archid: Joi.string().required()
            })
        },
        modelProceed: { 
            query: Joi.object().keys({
                source: Joi.string().required()
            })
        },
        datasetOptions:{
            query: Joi.object().keys({
                user: Joi.string().required()
            })
        },
        datasetCurrent:{
            query: Joi.object().keys({
                source: Joi.string().required()
            })
        },
        datasetUpdate: {
            body:  Joi.object().keys({
                source: Joi.string().required(),
                patients: Joi.array().required(),
                conditions: Joi.array().required(),
                compounds: Joi.array().required(),
                classes: Joi.array().required(),
                center: Joi.boolean().required(),
                normalise: Joi.boolean().required(),
                width: Joi.number().integer().min(1).required(),
                height: Joi.number().integer().min(1).required(),
                data_format : Joi.string().required(),
                color_format: Joi.string().required(),
                rescale: Joi.number().invalid(0).required(),
                rounds: Joi.number().min(0).required(),
                transform:Joi.boolean().required(),
                random:Joi.boolean().required(),
                keep:Joi.boolean().required(),
                rotation: Joi.number().min(0).max(1).required(),
                width_shift:Joi.number().min(0).max(1).required(),
                height_shift:Joi.number().min(0).max(1).required(),
                shear:Joi.number().min(0).max(1).required(),
                channel_shift:Joi.number().min(0).max(1).required(),
                brightness: Joi.number().min(0).invalid(0).max(1).required(),
                zoom: Joi.number().min(0).max(2).required(),
                horizontal_flip:Joi.boolean().required(),
                vertical_flip:Joi.boolean().required(),
                fill_mode: Joi.string().required(),
                cval: Joi.number().required(),
            })
        },
        configCurrent: {
            query: Joi.object().keys({
                source: Joi.string().required()
            })
        },
        configUpdate:{
            body: Joi.object().keys({
                source: Joi.string().required(),
                loss: Joi.string().required(),
                optimiser: Joi.string().required(),
                batchsize: Joi.number().min(1).required(),
                epochs: Joi.number().min(1).required(),
                lr: Joi.number().min(0).invalid(0).max(1).invalid(1).required(),
                momentum: Joi.number().min(0).max(1).invalid(1).required(),
                decay: Joi.number().min(0).max(1).invalid(1).required(),   
                nesterov: Joi.boolean().required(),
                shuffle: Joi.boolean().required(),
                amsgrad: Joi.boolean().required(),
                rho: Joi.number().min(0).invalid(0).max(1).invalid(1).required(),
                beta1: Joi.number().min(0).invalid(0).max(1).invalid(1).required(),
                beta2: Joi.number().min(0).invalid(0).max(1).invalid(1).required(),
                validation_split: Joi.number().min(0).invalid(0).max(1).invalid(1).required(),
                epsilon: Joi.number().min(0).invalid(0).max(1).invalid(1).allow(null),
                seed: Joi.number().integer().allow(null)
              
            })
           
        },
        learningCurrent: {
            query: Joi.object().keys({
                source: Joi.string().required()
            })
        },
        learningStart:{
            body: Joi.object().keys({
                source: Joi.string().required()
            })
        },
        learningReset:{
            body: Joi.object().keys({
                source: Joi.string().required()
            })
        },
        results: {
            body: Joi.object().keys({
                source: Joi.string().required()
            })
        }



    }

}