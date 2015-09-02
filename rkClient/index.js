var options = exports.options = {
 client_id: "d4804b5dead34df1a048f395a31f0886",
 client_secret: "302bf5faa6a840339d897ca97a5a29dd",
 auth_url: "https://runkeeper.com/apps/authorize",
 access_token_url: "https://runkeeper.com/apps/token",
 redirect_uri: "http://146.175.206.162:3101/setCode",
 //access_token: "",
 api_domain: "api.runkeeper.com"
};

var runkeeper = require('runkeeper-js');

var client = exports.client = new runkeeper.HealthGraph(options);

