var ActivityRouter = function(router, activityController) {
  this.router = router;
  this.router.get('/all', activityController.getAllActivities);
};

module.exports = ActivityRouter;
