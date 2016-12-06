require('dotenv').load({path: '.env'});

var redis = require('redis');
var RunkeeperRedis = require('./runkeeper/runkeeper.redis.server');

var rkRedis = new RunkeeperRedis(redis);

rkRedis.persistToken("Blablalba")
	.then(function(res) {
		console.log(res);
	})
	.then(function() {
		return rkRedis.loadToken();
	})
	.then(function(res) {
		console.log(res);
	})
	.catch(function(err) {
		console.log("ERR", err);
	});