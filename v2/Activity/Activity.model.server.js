var moment = require('moment');

var Activity = function(data) {
  this.start = data.start_time;
  this.startMoment = moment(this.start.substring(5,this.start.length), "D MMM YYYY HH:mm:ss");
  this.durationSeconds = data.duration;
  this.durationMinutes = Math.round(100 * this.durationSeconds / 60) / 100;
};

module.exports = Activity;
