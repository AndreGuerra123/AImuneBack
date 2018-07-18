//Import Internal Dependencies
const Loader = require('../models/loader.js');
const formi = require('formidable');
const fs = require('fs');

module.exports = {
    load: async (req, res, next) => {

        var form = new formi.IncomingForm();

        form.parse(req, function (err, fields, files) {

            if (err) {

                res.status(404).json(err);

            } else {

                try {
                    //Importing fields
                    const {
                        user,
                        patient,
                        condition,
                        compound,
                        classi
                    } = fields

                    //Importing image
                    const img = files.image;

                    const path = img.path;
                    const mime = img.type;

                    fs.readFile(path, function (err, data) {

                        if (err) {
                            res.status(404).json(err);
                        } else {
                            //Save load
                            const newLoader = new Loader({
                                user,
                                patient,
                                condition,
                                compound,
                                classi,
                                image: data,
                                mime
                            });
                        }
                    })

                    //Delete image in local storage
                    await fs.unlink(path);

                    await newLoader.save();

                    res.status(200).json("Load image sucessfully.");

                } catch (error) {

                    res.status(404).json(error);

                }
            }
        })
        next()
    }
};