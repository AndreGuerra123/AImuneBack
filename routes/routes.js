//External Dependencies
const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
require('../passport.js'); // Sets the authentication mechanisms in the passport

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

//Pushing the Controllers
const UsersController = require('../controllers/users');
const LoaderController = require('../controllers/loader.js');

//Pushing the validators
const {validator, schemas} = require('../common/validator.js');

const signUpValidation = validator(schemas.signUp);
const signInValidation = validator(schemas.signIn);
const loaderValidation = validator(schemas.loader);

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

router.route('/secret')
    .get(jwtAuthentication, UsersController.secret);

//Routing
/* router.route('/load')
    .post(loaderValidation,jwtAuthentication, LoaderController.load);
 */
    router.route('/load').post(LoaderController.load);

//Exporting routes

module.exports = router;