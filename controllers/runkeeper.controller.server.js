var rkClient = require('../rkClient');
var request = require('request');

var runkeeperDA = require('../dataAccess/runkeeper.da.server');

var login = exports.login = function(req,res) {
  runkeeperDA.loadToken()
  .then(rkClient.setToken)
  .then(function() {
    confirmLogin(req,res);
  }, function() {
    doLogin(req,res);
  })
  .catch(function(err) {
    res.json(err);
  });
}

var confirmLogin = exports.confirmLogin = function(req,res) {
  console.log("Confirming RunKeeper access token.");
  rkClient.client.profile(function(err,reply){
    if(err) {
      res.json(err);
      return false;
    }
    res.json("The RunKeeper access token is set for " + reply.name);
  });
}

function doLogin(req,res,next) {
  var request_params = {
    client_id: rkClient.options.client_id,
    response_type: "code",
    redirect_uri: rkClient.options.redirect_uri
  };

  var request_details = {
    method: "GET",
    uri:  rkClient.options.auth_url + "?" + buildUrlBodyString(request_params)
  };

  request(request_details, function(err, response, body) {
    if(err) {
      res.send(err);
    } else {
     res.send(body);
    }
  });
}

function buildUrlBodyString(params) {
  var paramList = [];
  for(pk in params) {
    paramList.push(pk+"="+request_params[pk]);
  };
  var body_string = paramList.join("&");
  return body_string;
}


// Middleware -----------------------------------------------------------------
var setToken = exports.setToken = function(req,res,next) {
  rkClient.getTokenFromRunkeeper(req.query.code)
  	.then(rkClient.setToken)
  	.then(runkeeperDA.persistToken)
    .then(function() {
      next();
    })
    .catch(function(err) {
      res.json(err);
    });
};

var attemptTokenLoad = exports.attemptTokenLoad = function(req,res,next) {
  runkeeperDA.loadToken()
  	.then(rkClient.setToken)
    .then(function() {
      req.runkeeperClient = rkClient;
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
