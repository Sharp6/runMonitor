var moment = require('moment');

exports.returnActivities = function(req,res) {
  req.runkeeperClient.client.fitnessActivities(function(err,reply) {
    if(err) {
      res.json(err);
      return false;
    }
    res.json(reply.items);
  });
}

exports.performCheck = function(req,res) {
  req.runkeeperClient.client.fitnessActivities(function(err,reply) {
    if(err) {
      res.json(err);
      return false;
    }
    var result = "dnr"+calculateCheck(reply.items[0].start_time).toString();
    res.json(result);
  });
}

exports.performColorCheck = function(req,res) {
 req.runkeeperClient.client.fitnessActivities(function(err,reply) {
    if(err) {
      res.json(err);
      return false;
    }
    var dnr = calculateCheck(reply.items[0].start_time);
    var color = convertDaysToColor(dnr);
    var result = "R" + color.red + "G" + color.green + "B" + color.blue + "E";
    //var result = "dnrColorR255G0B0E";
    console.log(result);
    res.json(result);
  }); 
}

function calculateCheck(lastItem) {
  var lastTraining = moment(new Date(lastItem));
  return moment().diff(lastTraining, 'days');  
}

function convertDaysToColor(days) {
  var red;
  var green;
  var blue; 

  switch(days) {
    case 0:
      red = 0;
      green = 0;
      blue = 255;
      break;
    case 1:
      red = 0;
      green = 100;
      blue = 255;
      break;
    case 2: 
      red = 0;
      green = 255;
      blue = 100;
      break;
    case 3: 
      red = 100;
      green = 255;
      blue = 0;
      break;
    case 4:
      red = 255;
      green = 100;
      blue = 0;
      break;
    default:
      red = 255;
      green = 0;
      blue = 0;
  }
  var color = {
    red: red,
    green: green,
    blue: blue
  }
  return color;
}