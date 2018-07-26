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
                "name": 1,
                "user": 1,
                "shared": 1,
                "date": 1
            })
            .then(docs => {
                return res.status(200).json(docs)
            })
            .catch(err => {
                return res.status(404).json(err)
            });
        next();

    },
    clone: async (req, res, next) => {},
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