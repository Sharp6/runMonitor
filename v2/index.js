require('dotenv').load({path: '.env'});

var redis = require('redis');
var runkeeper = require('runkeeper-js');
var express = require('express');
var app = express();

var cors = require('cors');
app.options('*', cors());
app.use(cors());

var RunkeeperRedis = require('./runkeeper/runkeeper.redis.server');
var RunkeeperClient = require('./runkeeper/runkeeper.client.server');
var RunkeeperRouter = require('./runkeeper/runkeeper.routes.server');
var RunkeeperController = require('./runkeeper/runkeeper.controller.server');

var rkRedis = new RunkeeperRedis(redis);
var rkClient = new RunkeeperClient(runkeeper);
var rkController = new RunkeeperController(rkClient, rkRedis);
var rkRouter = new RunkeeperRouter(express.Router(), rkController);

app.use('/', rkRouter.router);

app.listen(8080, function() {
		console.log("Example app listening on port 8080.");
});


/* REDIS TEST
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
*/
