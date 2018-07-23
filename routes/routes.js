//External Dependencies
const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
require('../passport.js'); // Sets the authentication mechanisms in the passport
const {celebrate} = require('celebrate');


//Pushing the Controllers
const UsersController = require('../controllers/users');
const LoaderController = require('../controllers/loader.js');
const DesignController = require('../controllers/design.js')

//Pushing the validators
const {
    schemas
} = require('../common/celebrate.js');
const signUpValidation = celebrate(schemas.signUp);
const logInValidation = celebrate(schemas.logIn);
const designInitValidation = celebrate(schemas.designInit);
const designSaveValidation = celebrate(schemas.designSave);
const designDeleteValidation = celebrate(schemas.designDelete);

const {
    forms
} = require('../common/forms.js');

const loaderValidation = forms.loader;

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

router.route('/load').post(//loaderValidation,
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