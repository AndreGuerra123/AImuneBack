//Import Internal Dependencies
const Designer = require('../models/design.js');

module.exports = {
    init: async (req, res, next) => {
        const {
            user
        } = req.value.body;

        await Designer.find({
            $or: [{
                user
            }, {
                shared: true
            }]
        }, function (err, docs) {
            if (err) {
                console.log(err)
                return res.status(404).json(err)
            } else {
                console.log(err)
                return res.status(200).json(docs)
            }
        });
        next();

    },

    save: async (req, res, next) => {

        const nametaken = await Designer.findOne({
            user: req.value.body.owner,
            name: req.value.body.name
        });

        if (nametaken) {
            return res.status(404).json('Architecture name already existent under this username, please rename architecture and try again.');
        }

        await Designer.create(req.value.body, function (err, results) {
            if (err) {
                res.status(404).json(err);
                console.log(err)
            } else {
                res.status(200).json(results);
            }
        });
        next();

    },

    delete: async (req, res, next) => {

        await Designer.findOneAndRemove({
            owner: req.value.body.owner,
            name: req.value.body.name
        }, function(err,results){
            if (err) {
                res.status(404).json(err);
                console.log(err)
            } else {
                res.status(200).json(results);
            }
        })

        next();


    }

};