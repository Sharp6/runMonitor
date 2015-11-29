var express = require('express');
var router = express.Router();

var runkeeperController = require('../controllers/runkeeper.controller.server');
var runkeeperActionsController = require('../controllers/runkeeperActions.controller.server');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Route for user authentication
router.get('/rkLogin', runkeeperController.login);

// Route for runkeeper redirection
router.get('/setCode', [runkeeperController.setToken,runkeeperController.confirmLogin]);

// Action routes
router.get('/activities', [runkeeperController.attemptTokenLoad,runkeeperActionsController.returnActivities]);
router.get('/check', [runkeeperController.attemptTokenLoad,runkeeperActionsController.performCheck]);
router.get('/timeSinceLastRun', [runkeeperController.attemptTokenLoad,runkeeperActionsController.performCheck]);
router.get('/colorTimeSinceLastRun', [runkeeperController.attemptTokenLoad,runkeeperActionsController.performColorCheck]);

module.exports = router;