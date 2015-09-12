var fs = require('fs');

var options = exports.options = {
 client_id: process.env.CLIENTID,
 client_secret: process.env.CLIENTSECRET,
 auth_url: "https://runkeeper.com/apps/authorize",
 access_token_url: "https://runkeeper.com/apps/token",
 redirect_uri: process.env.REDIRECTURI,
 //access_token: "",
 api_domain: "api.runkeeper.com",
 config_file: "./config.json" 
};

var runkeeper = require('runkeeper-js');

var client = exports.client = new runkeeper.HealthGraph(options);

exports.registerToken = function(code) {
	return setToken(code)
		.then(persistToken);
}

function setToken(code) {
	return new Promise(function(resolve, reject) {
		client.getNewToken(code, function(err, access_token) {
	    if(err) { 	    	
	      console.log("Error getting access token: " + err);
	      reject(err); 
	    } else {
	    	console.log("Setting token.");
	    	client.access_token = access_token;
	    	resolve(access_token);
	    }
		});
	});
}

function persistToken(token) {
	console.log("Staring to persist");
	return new Promise(function(resolve,reject) {
		fs.writeFile(options.config_file, JSON.stringify({'access_token':token}), function(err){
	  	if(err){
	  		console.log("Not persisting");
	    	reject(err);
	    } else {
	    	console.log("Persisted token.");
	    	resolve(token);
	    }
		});	
	});
}

exports.loadToken = function() {
	return new Promise(function(resolve,reject) {
		try {
	    config = JSON.parse(fs.readFileSync(options.config_file, 'utf-8'));
	    client.access_token = config.access_token;
	    resolve(client.access_token);
	  } catch(err) {
	    reject(err);
	  }
	});
}