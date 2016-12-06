"use strict";

var RunkeeperRedis = function(redis) {

	var redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_URL, {no_ready_check: true});
		redisClient.auth(process.env.REDIS_PASSWD, function (err) {
			if (err) {
				console.log(err);
			}
	});

	this.persistToken = function(token) {
		return new Promise(function(resolve,reject) {
			console.log("RKREDIS: Persisting token to redis.");
			redisClient.set("access_token", token, function(err,reply) {
				if(err) {
					reject(err);
				} else {
					resolve(reply);
				}
			});
		});
	};

	this.loadToken = function() {
		return new Promise(function(resolve,reject) {
			console.log("RKREDIS: Attempting to load access token from redis.");
			redisClient.get("access_token", function(err,reply) {
				if(err) {
					reject(err);
				} else {
					if(reply) {
						resolve(reply);
					} else {
						reject("No access token could be loaded.");
					}
				}
			});
		});
	};
};

module.exports = RunkeeperRedis;