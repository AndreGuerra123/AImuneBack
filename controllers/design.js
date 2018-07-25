//Import Internal Dependencies
const Designer = require('../models/design.js');
const Formidable = require('formidable');
const fs = require('fs');

module.exports = {
    init: async (req, res, next) => {

        const user = req.query.user;

       await Designer.find().or([{user: user},{shared: true}])
        .then(docs => {return res.status(200).json(docs)})
        .catch(err => {return res.status(404).json(err)});
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
                            file: JSON.parse(data)

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
        console.log(req);
        const {
            name,
            user,
            date,
            shared,
            file
        } = req.body;

        await Designer.update({
            name,
            user
        }, {
            name,
            user,
            date,
            shared,
            file
        }, {
            upsert: true,
            setDefaultsOnInsert: true
        }, function (err) {
            if (err) {
                return res.status(404).json(err);
            } else {
                return res.status(200).json('Model architecture saved sucessfully.')
            }
        })

        next();

    },
    delete: async (req, res, next) => {
           
            const user = req.query.user;
            const name = req.query.name;
   
            await Designer.findOneAndRemove({
                user,
                name
            }, function (err, arch) {
                if (err) {
                    return res.status(404).json(err);
                } else {
                    return res.status(200).json("Delete was sucessfull.")
                }
            })
      
        next();

    }

};