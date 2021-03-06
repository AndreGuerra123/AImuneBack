//External Dependencies
const router = require('express-promise-router')();
const passport = require('passport');
require('../passport.js'); // Sets the authentication mechanisms in the passport
const {
    celebrate
} = require('celebrate');


//Pushing the Controllers
const UsersController = require('../controllers/users.js');
const LoaderController = require('../controllers/loader.js');
const ImageController = require('../controllers/image.js');
const DatasetController = require('../controllers/dataset.js')
const DesignController = require('../controllers/design.js')
const ModelController = require('../controllers/model.js')
const PredictController = require('../controllers/predict.js')

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
const modelDeleteValidation = celebrate(schemas.modelDelete);
const modelCloneValidation = celebrate(schemas.modelClone);
const modelNewValidation = celebrate(schemas.modelNew);
const proceedStatusValidation = celebrate(schemas.modelProceed);
const proceedDatasetCurrentValidation = celebrate(schemas.datasetCurrent);
const proceedDatasetOptionsValidation = celebrate(schemas.datasetOptions);
const proceedDatasetUpdateValidation = celebrate(schemas.datasetUpdate);
const proceedConfigCurrentValidation = celebrate(schemas.configCurrent);
const proceedConfigUpdateValidation = celebrate(schemas.configUpdate);
const proceedLearningCurrentValidation = celebrate(schemas.learningCurrent);
const proceedLearningStartValidation = celebrate(schemas.learningStart);
const proceedLearningResetValidation = celebrate(schemas.learningReset);
const resultsValidation = celebrate(schemas.results)
const predictCurrentValidation = celebrate(schemas.predictCurrent)
const predictTransferTemporaryValidation = celebrate(schemas.predictTransferTemporary)
const predictClassTemporaryValidation = celebrate(schemas.predictClassTemporary)

//Pushing the authentications
const jwtAuthentication = passport.authenticate('jwt', {
    session: false
});
const localAuthentication = passport.authenticate('local', {
    session: false
});

//Routing

/////////////// AUTHENTICATION ////////
router.route('/signup')
    .post(signUpValidation, UsersController.signUp);

router.route('/login')
    .post(logInValidation, localAuthentication, UsersController.logIn);

////////////// LOADING /////////////

router.route('/load').post(LoaderController.load);

///////////// IMAGES ////////////////
router.route('/image').get(//jwtAuthentication,
    ImageController.image);

///////////// DATASET /////////////

router.route('/dataset').get(//jwtAuthentication,
    DatasetController.dataset);

//////////////////DESIGN////////////////

router.route('/design/init').get(designInitValidation,
    //jwtAuthentication,//..
    DesignController.init);

router.route('/design/savenew').post( //designSaveNewValidation,
    //jwtAuthentication,//.
    DesignController.savenew);

router.route('/design/saveold').post( //designSaveOldValidation,
    //jwtAuthentication,//.
    DesignController.saveold);

router.route('/design/delete').delete(designDeleteValidation,
    //jwtAuthentication,//..
    DesignController.delete);

////////////////MODEL///////////////////

router.route('/model/init').get(modelInitValidation, //jwtAuthentication,
    ModelController.init)

router.route('/model/delete').delete(modelDeleteValidation,
    //jwtAuthentication,//..
    ModelController.delete)

router.route('/model/clone').post(modelCloneValidation, //jwtAutentication
    ModelController.clone)

router.route('/model/new').post(modelNewValidation, //jwtAutentication
    ModelController.new)

//// Proceedings ////

//Status

router.route('/proceed/status').get(proceedStatusValidation, //jwtAutentication
    ModelController.proceed_status)

//Dataset

router.route('/dataset/current').get(proceedDatasetCurrentValidation,
    ModelController.proceed_dataset_current)

router.route('/dataset/options').get(proceedDatasetOptionsValidation,
    ModelController.proceed_dataset_options)

router.route('/dataset/update').post(proceedDatasetUpdateValidation,
    ModelController.proceed_dataset_update)


//Config

router.route('/config/current').get(proceedConfigCurrentValidation,
    ModelController.proceed_config_current)

router.route('/config/update').post(proceedConfigUpdateValidation,
    ModelController.proceed_config_update)

//Learning

router.route('/learning/current').get(proceedLearningCurrentValidation,
    ModelController.proceed_learning_current)
router.route('/learning/start').post(proceedLearningStartValidation,
    ModelController.proceed_learning_start)
router.route('/learning/reset').post(proceedLearningResetValidation,
    ModelController.proceed_learning_reset)

//Results
router.route('/results').post(resultsValidation,ModelController.proceed_results)    

//Predict
router.route('/predict/current').post(predictCurrentValidation,PredictController.predictCurrent)

router.route('/predict/loadTemporary').post(PredictController.predictLoadTemporary)

router.route('/predict/transferTemporary').post(predictTransferTemporaryValidation,PredictController.predictTransferTemporary)

router.route('/predict/classifyTemporary').post(predictClassTemporaryValidation,PredictController.predictClassTemporary)

//Exporting routes

module.exports = router;