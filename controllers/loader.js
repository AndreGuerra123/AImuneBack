//Import Dependencies
const JWT = require('jsonwebtoken');

//Import Internal Dependencies
const Loader = require('../models/loader.js');


function pkeys(any){
    let a = Object.keys(any)
    console.log(a)
    a.forEach(element => {
        pkeys(a[element]);
    });
}

module.exports = {
    load: async (req, res, next) => {
        
        pkeys(req);

        Object.keys(any);
        
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