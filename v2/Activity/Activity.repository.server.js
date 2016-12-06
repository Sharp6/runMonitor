var Activity = require('./Activity.model.server');

var ActivityRepo = function(rkController) {
  this.activities = [];

  this.augmentActivities = function() {
		this.activities.forEach(function(activity, index) {
			var prevActivity = this.activities[index+1];
			if(prevActivity) {
				activity.daysDelay = activity.startMoment.diff(prevActivity.startMoment, 'days');
			}
		}.bind(this));
  }.bind(this);

  this.loadAllActivities = function() {
		return rkController.get200Activities()
			.then(function(activities) {
				this.activities = activities.items.map(function(actData) {
					return new Activity(actData);
				});
			}.bind(this))
			.then(function() {
				this.augmentActivities();
			}.bind(this));
  }.bind(this);

  

  this.getLastActivity = function() {

	};
};

module.exports = ActivityRepo;
