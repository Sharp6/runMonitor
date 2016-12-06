var RunkeeperRoutes = function(router, rkController) {
  this.router = router;

  this.router.get('/', function(req,res) {
    res.send("Hello World");
  });

  // Route for user authentication
  this.router.get('/rkLogin', rkController.login);

  // Route for runkeeper redirection
  //router.get('/setCode', [rkController.getToken,rkController.confirmLogin]);
  this.router.get('/setCode', [rkController.setClient, rkController.getToken, rkController.persistToken, rkController.confirmLogin]);

  this.router.get('/activities', [rkController.setClient, rkController.loadToken, rkController.getActivities]);

  //var runkeeperActionsController = require('../controllers/runkeeperActions.controller.server');
  // Action routes
  /*
  router.get('/activities', [runkeeperController.attemptTokenLoad,runkeeperActionsController.returnActivities]);
  router.get('/check', [runkeeperController.attemptTokenLoad,runkeeperActionsController.performCheck]);
  router.get('/timeSinceLastRun', [runkeeperController.attemptTokenLoad,runkeeperActionsController.performCheck]);
  router.get('/colorTimeSinceLastRun', [runkeeperController.attemptTokenLoad,runkeeperActionsController.performColorCheck]);
  */
};

module.exports = RunkeeperRoutes;
