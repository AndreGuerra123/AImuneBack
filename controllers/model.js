//Import Internal Dependencies
const Modeler = require('../models/models.js');
const agenda = require('../common/agenda.js');

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

    delete: async (req, res, next) => {

        const user = req.query.user;
        const name = req.query.name;

        await Modeler.findOneAndRemove({
            user,
            name
        }, function (err, model) {
            if (err) {
                return res.status(404).json(err);
            } else {
                return res.status(200).json("Delete was sucessfull.")
            }
        })

        next();
    },

    clone: async (req, res, next) => {

        const {
            user,
            name,
            source
        } = req.body;

        await Modeler.findById(source).lean().exec(function (err, oldModel) {
            if (err) {
                return res.status(404)
            } else {

                delete oldModel._id;
                oldModel.user = user;
                oldModel.name = name;

                const newModel = Modeler(oldModel);
                newModel.save(function (error) {
                    if (error) {
                        return res.status(400).json(error)
                    }
                });

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
    proceed: async (req, res, next) => {
        try{
            const job =  await agenda.now('config',req.query);
            res.status(200).json(job);
        }catch(err){
            res.status(404).json(err)
        }
      
            
    }
    },
    proceed_config: async (req, res, next) => {





    },
    proceed_data: async (req, res, next) => {





    },
    proceed_train: async (req, res, next) => {





    },
    

};