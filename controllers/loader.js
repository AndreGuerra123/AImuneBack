//Import Dependencies
const JWT = require('jsonwebtoken');

//Import Internal Dependencies
const Loader = require('../models/loader.js');

module.exports = {
    load: async (req, res, next) => {

        console.log(Object.keys(req));
        console.log(Object.keys(req.body));
        
        const {
            user,
            patient,
            condition,
            compound,
            classi,
            image
        } = req.body;

        //Create NEw User
        const newLoader = new Loader({
            user,
            patient,
            condition,
            compound,
            classi,
            image
        });
        await newLoader.save();
        

        res.status(200)
        // Respond with token
        //const token  = signToken(newUser)
        //res.status(200).json({token});

        console.log("Load image sucessfully.")
        next()
    }
};