var express = require('express');
var router = express.Router();

var rkClient = require('../rkClient');
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/rk', function(req,res) {
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
});


router.get('/setCode', function(req,res) {
  rkClient.client.getNewToken(req.query.code, function(err, access_token) {
    if(err) { 
      console.log("Error getting access token.");
      console.log(err); 
      return false; 
    }
    rkClient.client.access_token = access_token;

    rkClient.client.profile(function(err,reply){
      if(err){ 
        console.log("Error getting profile.");
        console.log(err); 
        return false;
      } 
      console.log(reply);
      res.json("Got a reply:" + reply);
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
