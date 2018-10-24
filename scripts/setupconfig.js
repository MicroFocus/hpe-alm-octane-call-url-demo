const configFile = require("../configuration.json");
const sdkConfig = configFile.server;
const sdkOptions = configFile.authentication;
const newConfig = {config: sdkConfig, options: sdkOptions};
require('@microfocus/alm-octane-js-rest-sdk/scripts/generate_default_routes').generateDefaultRoutes(newConfig);



