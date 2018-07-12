//External Dependencies
const express = require('express');
const router = require('express-promise-router')();

//In-package Dependencies
const UsersController = require('../controllers/users');
const Validator = require('../common/validator.js');


//Routing
router.route('/signup')
    .post(Validator.validator(Validator.schemas.signup), UsersController.signUp);

router.route('/signin')
    .post(Validator.validator(Validator.schemas.signin), UsersController.signIn);

router.route('secret')
    .get(UsersController.secret);

//Exporting routes

module.exports = router;