var express = require('express');
var router = express.Router();


var fs = require('fs');
var rkClient = require('../rkClient');
var request = require('request');

// UGLY global
var config_file = "./config.json";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/rkLogin', function(req,res) {
  var config;
  try {
    config = JSON.parse(fs.readFileSync(config_file, 'utf-8'));
    rkClient.client.access_token = config.access_token;
  } catch(err) {
    console.log(err);
  }

  if(config) {
    rkClient.client.profile(function(err,reply){
      if(err) {
        res.json(err);
        return false;
      }
      res.json("Already logged in as: " + reply.name);
      console.log(reply);
    });
  } else {
      

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
});


router.get('/setCode', function(req,res) {
  rkClient.client.getNewToken(req.query.code, function(err, access_token) {
    if(err) { 
      console.log("Error getting access token.");
      console.log(err); 
      return false; 
    }
    rkClient.client.access_token = access_token;

    fs.writeFile(config_file, JSON.stringify({'access_token':access_token}), function(err){
      if(err){
        console.log(err);
      }
    });

    rkClient.client.profile(function(err,reply){
      if(err){ 
        console.log("Error getting profile.");
        console.log(err); 
        return false;
      } 
      console.log(reply);
      res.json("Now logged in as " + reply.name);
    });
  });    
});


router.get('/activities', function(req,res) {
  rkClient.client.fitnessActivities(function(err,reply) {
    if(err) {
      res.json(err);
      return false;
    }
    res.json(reply.items[0]);
  });
});

module.exports = router;
