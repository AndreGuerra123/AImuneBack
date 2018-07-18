//Import Dependencies
const JWT = require('jsonwebtoken');

//Import Internal Dependencies
const Loader = require('../models/loaders.js');

module.exports = {
    load: async (req, res, next) => {

        const {
            user,
            patient,
            condition,
            compound,
            classi,
            image,
            date_sampled,
            date_acquired
        } = req.value.body;

        //Create NEw User
        const newLoading = new Loader({
            user,
            patient,
            condition,
            compound,
            classi,
            image,
            date_sampled,
            date_acquired
        });
        await newLoader.save();

        res.status(200)
        // Respond with token
        //const token  = signToken(newUser)
        //res.status(200).json({token});

        console.log("Load image sucessfully.")

    }
};