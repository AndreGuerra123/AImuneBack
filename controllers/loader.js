//Import Internal Dependencies
const Loader = require('../models/loader.js');
const Formidable = require('formidable');
const fs = require('fs');

module.exports = {
    load: async (req, res, next) => {

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
                    classi
                } = fields;

                path = files.image.path;
                contentType = files.image.type;
                fs.readFile(path, async function (err, data) {

                    if (err) {

                        return res.status(404).json(err);

                    } else {

                        //Save load
                        const newLoader = new Loader({
                            user,
                            patient,
                            condition,
                            compound,
                            classi,
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

                        await newLoader.save();

                        res.status(200).json("Load image sucessfully.");

                        next()
                    }
                })
            }
        });
    }
};