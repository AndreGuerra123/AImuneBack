//External Dependencies
const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
require('../passport.js'); // Sets the authentication mechanisms in the passport

//Pushing the Controllers
const UsersController = require('../controllers/users');
const LoaderController = require('../controllers/loader.js');
const DesignController = require('../controllers/design.js')

//Pushing the validators
const {
    validator,
    schemas
} = require('../common/validator.js');

const signUpValidation = validator(schemas.signUp);
const signInValidation = validator(schemas.signIn);
const loaderValidation = validator(schemas.loader);
const designInitValidation = validator(schemas.designInit);
const designSaveValidation = validator(schemas.designSave);
const designDeleteValidation = validator(schemas.designDelete);


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

router.route('/load').post(//loaderValidation, //jwtAuthentication,//
     LoaderController.load);

router.route('design/init').get(designInitValidation, //jwtAuthentication,//..
     DesignController.init);

router.route('design/save').post(designSaveValidation, //jwtAuthentication,//.
     DesignController.save);

router.route('design/delete').post(designDeleteValidation, //jwtAuthentication,//..
     DesignController.delete);



//Exporting routes

module.exports = router;