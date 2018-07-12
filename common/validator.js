const Joi = require('joi');

module.exports = {

    /// Validator
    validator: (schema) => {
        return (requestAnimationFrame, res, next) => {
            const result = Joi.validate(req.body, schema);
            if (result.error) {
                return res.status(400).json(result.error);
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
            birthdate: Joi.date().required(),
            username: Joi.string().alphanum().min(3).max(30).required(),
            address: Joi.string().required(),
            postalcode: Joi.string().required(),
            city: Joi.string().required(),
            country: Joi.string().required(),
            telephone: Joi.number().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            auth_token: Joi.string().valid(['aimune_alcyomics_2018'])
        }),
        signIn: Joi.object().keys({
            username: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().required()
        })
    }

}