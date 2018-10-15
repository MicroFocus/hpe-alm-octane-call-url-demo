var configFile = require("../configuration.json");
var sdkConfig = configFile.server;
var sdkOptions = configFile.authentication;
var newConfig = {config: sdkConfig, options: sdkOptions};
require('@microfocus/alm-octane-js-rest-sdk/scripts/generate_default_routes').generateDefaultRoutes(newConfig);



