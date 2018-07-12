//External Dependencies
const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
require('../passport.js'); // Sets the authentication mechanisms in the passport

//In-package Dependencies
const UsersController = require('../controllers/users');
const {validator, schemas} = require('../common/validator.js');

//Pushing the validators
const signUpValidation = validator(schemas.signup);
const signInValidation = validator(schemas.signin);

//Pushing the authentications
const jwtAuthentication = passport.authenticate('jwt', {
    session: false
});
const localAuthentication = passport.authenticate('local', {
    session: false
});
//Routing
router.route('/signup')
    .post(signUpValidation, UsersController.signUp);

router.route('/signin')
    .post(signInValidation, localAuthentication, UsersController.signIn);

router.route('secret')
    .get(jwtAuthentication, UsersController.secret);

//Exporting routes

module.exports = router;