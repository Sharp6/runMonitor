var express = require('express');
var router = express.Router();

var rkClient = require('../rkClient');
var request = require('request');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/rkLogin', login);

function login(req,res) {
  rkClient.loadToken().then(function() {
    confirmLogin(req,res);
  }, function() {
    doLogin(req,res);
  })
  .catch(function(err) {
    console.log(err);
    res.json(err);
  });
}

function confirmLogin(req,res) {
  console.log("Confirming");
  rkClient.client.profile(function(err,reply){
    if(err) {
      res.json(err);
      return false;
    }
    res.json("You are logged in as: " + reply.name);
    console.log(reply);
  });
} 
      
function doLogin(req,res,next) {

  console.log("This is my rkClient.options: " + rkClient.options.client_id);

  var request_params = {
    client_id: rkClient.options.client_id,
    response_type: "code",
    redirect_uri: rkClient.options.redirect_uri
  };

  var paramList = [];
  for(pk in request_params) {
    paramList.push(pk+"="+request_params[pk]);
  };
  var body_string = paramList.join("&");

  var request_details = {
    method: "GET",
    uri:  rkClient.options.auth_url + "?" + body_string
  };

  request(request_details, function(err, response, body) {
    console.log("Got here." + request_details.uri);
    if(err) {
      res.send(err);
    } else {
     res.send(body);
    }
  });
}

router.get('/setCode', [setToken,confirmLogin]);

function setToken(req,res,next) {
  rkClient.registerToken(req.query.code)
    .then(function() {
      next();
    })
    .catch(function(err) {
      res.json(err);
    });
}  



router.get('/activities', [attemptTokenLoad,returnActivities]);

function attemptTokenLoad(req,res,next) {
  rkClient.loadToken()
    .then(function() {
      next();
    }, function(err) {
      console.log(err);
      tokenLoadFailed(req,res);
    })
    .catch(function(err) {
      tokenLoadFailed(req,res);
    });
}

function tokenLoadFailed(req,res) {
  res.json("NO_LOGIN");
}

function returnActivities(req,res) {
  rkClient.client.fitnessActivities(function(err,reply) {
    if(err) {
      res.json(err);
      return false;
    }
    res.json(reply.items);
  });
}


router.get('/activityFeed', [attemptTokenLoad,returnActivityFeed]);

function returnActivityFeed(req,res) {
  rkClient.client.fitnessActivityFeed(function(err,reply) {
    if(err) {
      res.json(err);
      return false;
    }
    res.json(reply);
  });
}

router.get('/getAllActivities', [attemptTokenLoad,returnAllActivities]);
function returnAllActivities(req,res) {
  var allActivities = Array();
  var initialUrl = "/fitnessActivities?page=0&pageSize=25";
  (function getOnePage(url){
    rkClient.client.apiCall('GET', "application/vnd.com.runkeeper.FitnessActivityFeed+json", url, function(err,reply) {
      if(err) {
        res.json(err);
        return false;
      }
      allActivities.push.apply(allActivities, reply.items);
      if(reply.next) {
        getOnePage(reply.next);
      } else {
        res.json(allActivities);
      }
    });
  })(initialUrl);
}

function getActivitiesFromFeed(url, cb) {
  rkClient.client.apiCall('GET', "application/vnd.com.runkeeper.FitnessActivityFeed+json", url, function(err,reply) {
    if(err) {
      res.json(err);
      return false;
    }
    cb(reply);
  });
}

router.get('/check', [attemptTokenLoad,performCheck]);

function performCheck(req,res) {
  rkClient.client.fitnessActivities(function(err,reply) {
    if(err) {
      res.json(err);
      return false;
    }
    var result = calculateCheck(reply.items[0].start_time);
    res.json(result);
  });
}

router.get('/checkRaw', [attemptTokenLoad,performCheckNoJson]);
function performCheckNoJson(req,res) {
  rkClient.client.fitnessActivities(function(err,reply) {
    if(err) {
      res.json(err);
      return false;
    }
    var result = calculateCheck(reply.items[0].start_time);
    res.send(result.toString() + "\r");
    res.end();
  }); 
}

function calculateCheck(lastItem) {
  var lastTraining = moment(new Date(lastItem));
  return moment().diff(lastTraining, 'days');  
}

module.exports = router;
