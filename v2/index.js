require('dotenv').load({path: '.env'});

var redis = require('redis');
var runkeeper = require('runkeeper-js');

var RunkeeperRedis = require('./runkeeper/runkeeper.redis.server');
var RunkeeperClient = require('./runkeeper/runkeeper.client.server');

var rkRedis = new RunkeeperRedis(redis);
var rkClient = new RunkeeperClient(runkeeper, rkRedis);

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