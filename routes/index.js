var express = require('express');
var router = express.Router();
var cors = require('cors');

var runkeeperController = require('../controllers/runkeeper.controller.server');
var runkeeperActionsController = require('../controllers/runkeeperActions.controller.server');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Route for user authentication
router.options('/rkLogin', cors());
router.get('/rkLogin', cors(), runkeeperController.login);

// Route for runkeeper redirection
router.options('/setCode', cors());
router.get('/setCode', cors(), [runkeeperController.setToken,runkeeperController.confirmLogin]);

// Action routes
router.get('/activities', [runkeeperController.attemptTokenLoad,runkeeperActionsController.returnActivities]);
router.get('/check', [runkeeperController.attemptTokenLoad,runkeeperActionsController.performCheck]);
router.get('/timeSinceLastRun', [runkeeperController.attemptTokenLoad,runkeeperActionsController.performCheck]);
router.get('/colorTimeSinceLastRun', [runkeeperController.attemptTokenLoad,runkeeperActionsController.performColorCheck]);

module.exports = router;
