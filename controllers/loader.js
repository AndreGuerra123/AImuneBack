//Import Internal Dependencies
const Loader = require('../models/loader.js');

module.exports = {
    load: async (req, res, next) => {

        // get gridform
        const form = req.app.get('gridform')()

        await form.parse(req, async function (err, fields, files) {

            if (err) {

                return res.status(404).json(err);

            } else {

                const {
                    user,
                    patient,
                    condition,
                    compound,
                    classi,
                    shared
                } = fields;

                try{

                    var file = files.image.upload;
                    const newLoader = new Loader({
                        user,
                        patient,
                        condition,
                        compound,
                        classi,
                        shared,
                        image: file.id
                    });
                    await newLoader.save();
                    res.status(200).json("Load image sucessfully.");
                    next()

                }catch(err){
                    res.status(400).json(err);
                    next()
                }
               
            }
        })
    }
};