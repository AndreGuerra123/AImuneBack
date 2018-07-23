//Import Internal Dependencies
const Loader = require('../models/loader.js');
const Formidable = require('formidable');
const fs = require('fs');

module.exports = {
load: (req, res, next) => {

var form = new Formidable.IncomingForm();

let path,
    contentType,
    user,
    patient,
    condition,
    compound,
    classi;

form.parse(req, function (err, fields, files) {

    if (err) {

        return res.status(404).json(err);

    } else {

        ({
            user,
            patient,
            condition,
            compound,
            classi
        } = fields);
        path = files.image.path;
        contentType = files.image.type;

    }
});



fs.readFile(path, function (err, data) {

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

        newLoader.save();
        res.status(200).json("Load image sucessfully.");
        next()
    }
});

}
}

