var ActivityController = function(activityRepo) {
	this.getAllActivities = function(req,res) {
		activityRepo.loadAllActivities()
			.then(function(activities) {
				res.send(activityRepo.activities);
			})
			.catch(function(err) {
				res.send(err);
			});
	};
};

module.exports = ActivityController;