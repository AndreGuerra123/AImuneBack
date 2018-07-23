//Import Internal Dependencies
const Formidable = require('formidable');
const {Joi} = require('celebrate');


const loaderSchema = Joi.object().keys({
    user: Joi.string().required(),
    patient: Joi.string(),
    condition: Joi.string(),
    compound: Joi.string(),
    class: Joi.number().required(),
    image: Joi.any().required(),
})

//Import Internal Dependencies
module.exports = {

    loader: async function (req, res, next) {

        const Form = new Formidable.IncomingForm()
        let tovalidate;
        Form.parse(req,function (err, fields, files) {
            if (err) {
                return res.status(404).json(err);
            }else{
              tovalidate = {...fields,...files};
            }
        });

        //validate
        const result = Joi.validate(tovalidate, loaderSchema);
        if(result.error){
            return res.status(404).json(result.error);
        }

        next();

    }

}