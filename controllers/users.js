//Import Dependencies
const JWT = require('jsonwebtoken');

//Import Internal Dependencies
const User = require('../models/users');
const {JWT_SECRET} = require('../config/index.js')

signToken = user => {
    var curTime  = new Date().getTime()
    var curDate = new Date().getDate();
    
    return JWT.sign({
        iss: 'Alcyomics',
        sub: user._id,
        iat: curTime,
        exp: new Date().setDate(curDate + 1)//+ 1 day ahead
    },JWT_SECRET);
}

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
        const token  = signToken(newUser)
        res.status(200).json({token});

        console.log("Sign Up sucessfully.")

    },
    signIn: async (req, res, next) => {
        const token = signToken(req.user);
        res.status(200).json({token});

        console.log("Sign in sucessfully.")
    },
    secret: async (req, res, next) => {
       console.log('I manage to get the secret!');
    }
};