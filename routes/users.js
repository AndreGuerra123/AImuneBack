//External Dependencies
const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
require('../passport.js'); // Sets the authentication mechanisms in the passport

//In-package Dependencies
const UsersController = require('../controllers/users');
const Validator = require('../common/validator.js');

//Pushing the validators
const signUpValidation = Validator.validator(Validator.schemas.signup);
const signInValidation = Validator.validator(Validator.schemas.signin);

//Pushing the authentications
const jwtAuthentication = passport.authenticate('jwt', {
    session: false
});
const localAuthentication = passport.authenticate('local', {
    session: false
});
//Routing
router.route('/signup')
    .post(singUpValidation, UsersController.signUp);

router.route('/signin')
    .post(singInValidation, localAuthentication, UsersController.signIn);

router.route('secret')
    .get(jwtAuthentication, UsersController.secret);

//Exporting routes

module.exports = router;