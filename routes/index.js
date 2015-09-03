var express = require('express');
var router = express.Router();


var fs = require('fs');
var rkClient = require('../rkClient');
var request = require('request');
var moment = require('moment');
// UGLY global
var config_file = "./config.json";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/rkLogin', [attemptConfigLoad,doLogin]);

function attemptConfigLoad(req,res,next) {
  var config;
  try {
    config = JSON.parse(fs.readFileSync(config_file, 'utf-8'));
    rkClient.client.access_token = config.access_token;
  } catch(err) {
    console.log(err);
  }

  if(config) {
    confirmLogin(req,res,next);
  } else {
    next();
  }
}

function confirmLogin(req,res) {
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
    if(err) {
      res.send(err);
    } else {
     res.send(body);
    }
  });
}

router.get('/setCode', [setToken,confirmLogin]);

function setToken(req,res,next) {
  rkClient.client.getNewToken(req.query.code, function(err, access_token) {
    if(err) { 
      console.log("Error getting access token.");
      console.log(err); 
      res.json(err);
      return false; 
    }
    rkClient.client.access_token = access_token;

    fs.writeFile(config_file, JSON.stringify({'access_token':access_token}), function(err){
      if(err){
        console.log(err);
        res.json(err);
        return false;
      }
    });

    next();
  });
}  

router.get('/activities', returnActivities);

function returnActivities(req,res) {
  rkClient.client.fitnessActivities(function(err,reply) {
    if(err) {
      res.json(err);
      return false;
    }
    res.json(reply.items);
  });
}

router.get('/check', performCheck);

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

function calculateCheck(lastItem) {
  var lastTraining = moment(new Date(lastItem));
  return moment().diff(lastTraining, 'days');  
}

module.exports = router;
