//External Dependencies
const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
require('../passport.js'); // Sets the authentication mechanisms in the passport
const {
    celebrate
} = require('celebrate');


//Pushing the Controllers
const UsersController = require('../controllers/users');
const LoaderController = require('../controllers/loader.js');
const DesignController = require('../controllers/design.js')
const ModelController = require('../controllers/model.js')

//Pushing the validators
const {
    schemas
} = require('../common/celebrate.js');
const signUpValidation = celebrate(schemas.signUp);
const logInValidation = celebrate(schemas.logIn);
const designInitValidation = celebrate(schemas.designInit);
//const designSaveNewValidation = celebrate(schemas.designSaveNew);
//const designSaveOldValidation = celebrate(schemas.designOldNew);
const designDeleteValidation = celebrate(schemas.designDelete);

const modelInitValidation = celebrate(schemas.modelInit);
const designDeleteValidation = celebrate(schemas.modelDelete);
const modelCloneValidation = celebrate(schemas.modelClone);
const modelNewValidation = celebrate(schemas.modelNew);
const modelProceedValidation = celebrate(schemas.modelProceed);

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

router.route('/load').post( //jwtAuthentication, In this case validation is done in the front end due to dificulties in importing form dat as body .
    LoaderController.load);

//////////////////DESIGN////////////////

router.route('/design/init').get(designInitValidation,
    //jwtAuthentication,//..
    DesignController.init);

router.route('/design/savenew').post(//designSaveNewValidation,
    //jwtAuthentication,//.
    DesignController.savenew);

router.route('/design/saveold').post(//designSaveOldValidation,
    //jwtAuthentication,//.
    DesignController.saveold);

router.route('/design/delete').delete(designDeleteValidation,
    //jwtAuthentication,//..
    DesignController.delete);

////////////////MODEL///////////////////

router.route('/model/init').get(modelInitValidation,//jwtAuthentication,
    ModelController.init)

router.route('/model/delete').delete(modelDeleteValidation,
        //jwtAuthentication,//..
        ModelController.delete)

router.route('/model/clone').post(modelCloneValidation,//jwtAutentication
    ModelController.clone)

router.route('/model/new').post(modelNewValidation,//jwtAutentication
    ModelController.new)

router.route('/model/proceed').get(modelProceedValidation,//jwtAutentication
        ModelController.proceed)

//Exporting routes

module.exports = router;