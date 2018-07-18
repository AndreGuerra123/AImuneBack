//Import Internal Dependencies
const Loader = require('../models/loader.js');
const formi = require('formidable');
const fs = require('fs');

module.exports = {
    load: async (req, res, next) => {

        var form = new formi.IncomingForm();

        let vars;
        let image;
        let path;
        let mime;

        form.parse(req, function (err, fields, files) {

            if (err) {

                res.status(404).json(err);

            } else {

                vars = fields;
                path = files.image.path;
                mime = files.image.type;

            }
        });
        fs.readFile(path, function (err, data) {

            if (err) {
                res.status(404).json(err);
            } else {
                image = data;
            }
        })

        //Save load
        const newLoader = new Loader({
            user,
            patient,
            condition,
            compound,
            classi,
            image,
            mime
        });

        //Delete image in local storage
        fs.unlink(path);

        await newLoader.save();

        res.status(200).json("Load image sucessfully.");
    }

};