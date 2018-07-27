//Import Internal Dependencies
const Modeler = require('../models/models.js');

module.exports = {
    init: async (req, res, next) => {

        const user = req.query.user;


        await Modeler.find().or([{
                user: user
            }, {
                shared: true
            }]).select({
                "id": 1,
                "name": 1,
                "user": 1,
                "shared": 1,
                "date": 1,
                "architecture.name": 1,
                "architecture.user": 1

            })
            .then(docs => {
                return res.status(200).json(docs)
            })
            .catch(err => {
                return res.status(404).json(err)
            });
        next();

    },
    clone: async (req, res, next) => {

        const {
            user,
            name,
            source
        } = req.body;

        var oldModel;
        await Modeler.findById(source).lean().exec(function (err, modelfound) {
            if (err) {
                return res.status(404)
            } else {
                if (modelfound) {
                    oldModel = modelfound;
                } else {
                    return res.status(404).json("No model found with such id.")
                }

            }
        });

        console.log(oldModel._id);
        console.log(oldModel.id)

        delete oldModel._id;
        oldModel.user = user;
        oldModel.name = name;

        const newModel = Modeler(oldModel);
        await newModel.save(function (error) {
            if (error) {
                return res.status(400).json(error)
            } else {
                return res.status(200).json(newModel._id)
            }
        });

    },
    new: async (req, res, next) => {
        try {
            const {
                name,
                user,
                shared,
                date,
                architecture
            } = req.body;

            const newModel = new Modeler({
                name,
                user,
                shared,
                date,
                architecture
            });

            await newModel.save();
            return res.status(200).json({
                id: newModel.id
            });
        } catch (err) {
            console.log(err);
            return res.status(404).json(err);
        }

    },
    proceed: async (req, res, next) => {},

};