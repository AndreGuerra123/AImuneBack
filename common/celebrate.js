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
            params: Joi.object().keys({
                user: Joi.string().required(),
            })
        },
        designSave: {
            body: Joi.object().keys({
                name: Joi.string().required(),
                user: Joi.string().required(),
                date: Joi.date().required(),
                shared: Joi.boolean().required(),
                file: Joi.object().required()
            })
        },
        designDelete: {
            params: Joi.object().keys({
                name: Joi.string().required(),
                user: Joi.string().required()
            })
        }

    }

}