var request = require('request');

var RunkeeperController = function(rkClient, rkRedis) {
  function buildUrlBodyString(params) {
    var paramList = [];
    for(pk in params) {
      paramList.push(pk+"="+params[pk]);
    };
    var body_string = paramList.join("&");
    return body_string;
  }

  this.login = function(req,res) {
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
  };

  this.setToken = function() {

  };

  this.confirmLogin = function(req,res) {
    req.client.profile(function(err,reply){
      if(err) {
        res.json(err);
        return false;
      }
      res.send("The RunKeeper access token is set for " + reply.name);
    });
  };

  this.returnActivities = function(req,res) {
    console.log("Getting activities");
    req.client.fitnessActivities(function(err,reply) {
      if(err) {
        res.send(err);
        return false;
      }
      console.log("Got reply", reply);
      res.json(reply.items);
    });
  };

  this.getActivities = function() {
    return new Promise(function(resolve,reject) {
      console.log(rkClient);
      rkClient.client.fitnessActivities(function(err,reply) {
        if(err) {
          return reject(err);
        }
        resolve(reply);
      });
    });
  };

  // SOOOOOOO ugly, refactor please!
  this.get200Activities = function() {
    return new Promise(function(resolve,reject) {
      console.log(rkClient);
      rkClient.client.apiCall("GET", undefined, "/fitnessActivities?page=0&pageSize=200", function(err,reply) {
        if(err) {
          return reject(err);
        }
        resolve(reply);
      });
    });
  };

  // Middleware -----------------------------------------------------------------
  this.getToken = function(req,res,next) {
    req.client.getNewToken(req.query.code, function(err, accessToken) {
      if(err) {
        res.send(err);
      } else {
        req.client.access_token = accessToken;
        next();
      }
    });
  };

  this.loadToken = function(req,res,next) {
    console.log("Loading token.");
    rkRedis.loadToken()
      .then(function(token) {
        console.log("Setting token to req", token);
        req.client.access_token = token;
        next();
      })
      .catch(function(err) {
        res.send(err);
      });
  };

  this.setClient = function(req,res,next) {
    // This is dirty
    console.log("Setting client to req");
    req.client = rkClient.client;
    next();
  };

  this.persistToken = function(req,res,next) {
    rkRedis.persistToken(req.client.access_token)
      .then(function() {
        next();
      })
      .catch(function(err) {
        res.send(err);
      });
  }

  // LOCAL API ---------------------------------------------------------
  this.getClient = function() {
    // Very dirty
    return rkClient;
  }

};

module.exports = RunkeeperController;
