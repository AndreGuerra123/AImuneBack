//Import Internal Dependencies
const Designer = require('../models/design.js');
const Formidable = require('formidable');

module.exports = {
    init: async (req, res, next) => {

        const user = req.params['user'];

        await Designer.find({
            $or: [{
                user
            }, {
                shared: true
            }]
        }, function (err, docs) {
            if (err) {
                return res.status(404).json(err)
            } else {
                return res.status(200).json(docs)
            }
        });
        next();

    },

    savenew: async (req, res, next) => {
        var form = new Formidable.IncomingForm();
        var path;
        await form.parse(req, async function (err, fields, files) {
            if (err) {
                console.log(err)
                return res.status(404).json(err);
            } else {
                const {
                    user,
                    name,
                    date,
                    shared
                } = fields;

                const nametaken = await Designer.findOne({
                    name,
                    $or: [{
                        user
                    }, {
                        shared: true
                    }]
                });
        
                if (nametaken) {
                    return res.status(404).json('Architecture name already existent under this username, please rename architecture and try again.');
                }

                path = files.kerasfile.path;
                fs.readFile(path, async function (err, data) {

                    if (err) {

                        return res.status(404).json(err);

                    } else {

                        //Save load
                        const newDesigner = new Designer({
                            user,
                            name,
                            date,
                            shared,
                            file: JSON.parse(data);
                        });

                        //Delete image in local storage
                        await fs.unlink(path, function (error) {
                            if (error) {
                                return res.status(404).json(error);
                            }

                        });

                        await newDesigner.save();

                        res.status(200).json("Load image sucessfully.");

                        next()
                    }
                });
            }
        });
    },
    saveold: async (req, res, next) => {

    },
    delete: async (req, res, next) => {

        await Designer.findOneAndRemove({
            owner: req.value.body.owner,
            name: req.value.body.name
        }, function (err, results) {
            if (err) {
                return res.status(404).json(err);
            } else {
                res.status(200).json(results);
            }
        })

        next();


    }

};