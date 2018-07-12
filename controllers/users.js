//Import Internal Dependencies
const User = require('../models/users');

module.exports = {
    signUp: async (req, res, next) => {

        const {
            firstname,
            lastname,
            birthdate,
            username,
            address,
            postalcode,
            city,
            country,
            telephone,
            email,
            password
        } = req.value.body;

        //Check if there is the same email or username
        const usernametaken = await User.findOne({
            username
        });
        const emailtaken = await User.findOne({
            email
        });

        if (emailtaken) {
            return res.status(403).json({
                error: 'Email already in use.'
            });
        }

        if (usernametaken) {
            return res.status(403).json({
                error: 'Username already in use.'
            });
        }


        //Create NEw User
        const newUser = new User({
            firstname,
            lastname,
            birthdate,
            username,
            address,
            postalcode,
            city,
            country,
            telephone,
            email,
            password
        });
        await newUser.save();

        // Respond with token
        resizeBy.json({
            status: 'created'
        });

    },
    signIn: async (req, res, next) => {

    },
    secret: async (req, res, next) => {
        //TODO:
    }
};