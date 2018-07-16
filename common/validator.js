const Joi = require('joi');
const {INVITE_TOKEN} = require('../config/index.js')

module.exports = {

    /// Validator
    validator: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);
            if (result.error) {
                return res.json(result.error);
            }
            if (!req.value) {
                req.value = {};
            }
            req.value['body'] = result.value;
            next();

        }
    },


    ///Schemas 

    schemas: {
        signUp: Joi.object().keys({
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            birthdate: Joi.string().required(),
            username: Joi.string().alphanum().min(3).max(30).required(),
            address: Joi.string().required(),
            postalcode: Joi.string().required(),
            city: Joi.string().required(),
            country: Joi.string().required(),
            telephone: Joi.number().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            auth_token: Joi.string().valid(INVITE_TOKEN)
        }),
        signIn: Joi.object().keys({
            username: Joi.string().required(),
            password: Joi.string().required()
        })
    }

}