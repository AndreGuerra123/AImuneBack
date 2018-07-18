//Import Internal Dependencies
const Loader = require('../models/loader.js');
const formi = require('formidable');

module.exports = {
    load: async (req, res, next) => {

        var form = new formi.IncomingForm();

        form.parse(req, function(err,fields,files){
            console.log(fields);
            console.log(files);
            res.writeHead(200, {'content-type': 'text/plain'});
            res.write('received upload:\n\n');
            res.end(util.inspect({fields: fields, files: files}));
        })

/*         const {
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
        //res.status(200).json({token}); */

        console.log("Load image sucessfully.")
        next()
    }
};