var options = exports.options = {
 client_id: process.env.CLIENTID,
 client_secret: process.env.CLIENTSECRET,
 auth_url: "https://runkeeper.com/apps/authorize",
 access_token_url: "https://runkeeper.com/apps/token",
 redirect_uri: process.env.REDIRECTURI,
 api_domain: "api.runkeeper.com"
};

var runkeeper = require('runkeeper-js');

var client = exports.client = new runkeeper.HealthGraph(options);

var redis = require('redis');
var redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_URL, {no_ready_check: true});
redisClient.auth(process.env.REDIS_PASSWD, function (err) {
    if (err) {
      console.log(err);
    }
});

exports.getTokenFromRunkeeper = function(authorizationCode) {
	return new Promise(function(resolve, reject) {
		console.log("Getting access token from RunKeeper.");
		client.getNewToken(authorizationCode, function(err, accessToken) {
	    if(err) { 	    	
	      console.log("Error getting access token: " + err);
	      reject(err); 
	    } else {
	    	resolve(accessToken);
	    }
		});
	});
}

exports.setToken = function(accessToken) {
	console.log("Setting access token in local client.");
	client.access_token = accessToken;
	return accessToken;
}

function persistToken(token) {
	console.log("Staring to persist");
	return new Promise(function(resolve,reject) {
		redisClient.set("access_token", token, function(err,reply) {
			if(err) {
				reject(err);
			} else {
				resolve(reply);
			}
		});
	});
}

exports.loadToken = function() {
	return new Promise(function(resolve,reject) {
		redisClient.get("access_token", function(err,reply) {
			if(err) {
				reject(err);
			} else {
				if(reply) {
					client.access_token = reply;
					resolve(reply);	
				} else {
					reject("No access token");
				}
			}
		});
	});
}