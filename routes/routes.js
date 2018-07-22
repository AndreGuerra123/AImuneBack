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
    bodyValidator,
    paramsValidator,
    schemas
} = require('../common/validator.js');

const signUpValidation = bodyValidator(schemas.signUp);
const logInValidation = bodyValidator(schemas.logIn);
const loaderValidation = bodyValidator(schemas.loader);
const designInitValidation = paramsValidator(schemas.designInit);
const designSaveValidation = bodyValidator(schemas.designSave);
const designDeleteValidation = paramsValidator(schemas.designDelete);


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

router.route('/login')
    .post(logInValidation, localAuthentication, UsersController.logIn);

//put jwt authentication on all this

router.route('/load').post(loaderValidation,
     //jwtAuthentication,
     LoaderController.load);

router.route('/design/init').get(designInitValidation, 
    //jwtAuthentication,//..
     DesignController.init);

router.route('/design/save').post(designSaveValidation,
     //jwtAuthentication,//.
     DesignController.save);

router.route('/design/delete').post(designDeleteValidation,
     //jwtAuthentication,//..
     DesignController.delete);



//Exporting routes

module.exports = router;