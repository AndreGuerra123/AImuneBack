const {Joi} = require('celebrate');
const {
    INVITE_TOKEN
} = require('../config/index.js')

const {proceedSchemas} = require('../controllers/model.js');

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
                architecture: Joi.object().required()
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
            body: proceedSchemas.datasetSchema
        },
        configCurrent: {
            query: Joi.object().keys({
                source: Joi.string().required()
            })
        },
        configUpdate:{
            body: proceedSchemas.configSchema
        }



    }

}