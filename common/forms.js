//Import Internal Dependencies
const Formidable = require('formidable');
const {
    Joi
} = require('celebrate');


const loaderSchema = Joi.object().keys({
    user: Joi.string().required(),
    patient: Joi.string(),
    condition: Joi.string(),
    compound: Joi.string(),
    classi: Joi.number().integer().min(0).max(5).required(),
})

//Import Internal Dependencies
module.exports = {
    forms: {
        loader: async function (req, res, next) {
            const Form = new Formidable.IncomingForm()
            await Form.parse(req, function (err, fields, files) {
                if (err) {
                    console.log(err)
                    return res.status(404).json(err);
                } else {                 
                    //validate
                    const result = Joi.validate(fields, loaderSchema);
                    if (result.error) { 
                        console.log(result.error)
                        return res.status(404).json(result.error);
                    } else {
                        next();
                    }
                }
            });
        }
    }
}