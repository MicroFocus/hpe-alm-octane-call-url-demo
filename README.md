# HPE ALM Octane Call URL/REST API Demo

This project is a simple [node.js](http://nodejs.org) project that demonstrates using HPE ALM Octane's *Call URL* to call
an external system and Octane's REST API to call back and change a field with Octane.

This project demonstrates how a loop can be built that enables Octane to integrate with any external system that supports
REST calls.

For more information about *Call URL* and the *REST API* please see Octane's documentation.

This project uses the [hpe-alm-octane-js-rest-sdk](https://github.com/HPSoftware/alm-octane-js-rest-sdk) project that enables
easy integration with REST APIs.

## Use Case
* A UDF is created for a *defect* called *rework_counter_udf*.  This field is of type number.
* A *Call URL* business rule is created for *defects*.  The rule has a condition that the *Phase* field is modified. 
 When the defect is updated the URL `server:port/calculator` resource is called
* This node.js server listens to that URL and if the phase was either **fixed** or **closed** and is now **opened** then 
it will get the *rework_counter_udf* field from the calling *defect* and update the number by 1

## Installation
* Run `npm install` on the root of the project
* Update the *configuration.json* file in the root of the project with the correct details of the Octane server.
  * You have a choice of using either client_id/secret authentication (recommended) or user/pass
  * Choose one of the methods and change its key to just `authentication` for example:
    ```
    "authentication": {
        "client_id": "id",
        "client_secret": "secret"
      }   
    ```
* Run the server using the `node bin\www` command

## License
Apache 2.0