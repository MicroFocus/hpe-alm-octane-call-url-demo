/**
 * Copyright 2018 EntIT Software LLC, a Micro Focus company
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var express = require('express');
var router = express.Router();
var octane = require('../src/octane');

/* POST endpoint for the CALLURL */
router.post('/', function(req, res, next) {
	//var phaseChange = JSON.parse(req.body);
	// console.log ('post body: '+JSON.stringify(req.body, null, 4));
	if (req.query.test === 'true'){
		// to send a response back for the Test Connection from Octane
		res.status(200).send();
	} else {
		octane.parsePhaseChange(req.body);
	}
});

module.exports = router;
