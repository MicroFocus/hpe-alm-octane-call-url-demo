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
 * *
 * Uses the alm octane rest sdk to get phases and then update defects as needed
 */
var Octane = require('@microfocus/alm-octane-js-rest-sdk');
var _ = require('underscore');
var fs = require('fs');
var configuration = JSON.parse(fs.readFileSync('configuration.json', 'utf8'));
var newValueRegex = /\[\[id=([\d]+).*/;
var originalValueRegex = /.*id=([\d]+).*/;
var defectPhases;

// read configuration from file
var octane = new Octane(configuration.server);
var authentication = configuration.authentication;

// start initial authentication and get phases
octane.authenticate(authentication, function(err) {
	if (err) {
		console.log('Error - %s', err.message.description);
		return
	}

	// get phases
	octane.phases.getAll({}, function(err, phases) {
		if (err) {
			console.log('Error - %s', err.message);
			return
		}

		// get phases that are relevant to defects
		defectPhases = _.filter(phases, function(phase) {
			return phase.logical_name.startsWith('phase.defect');
		});
	});
});

// called when a phase is changed
function parsePhaseChange(changes) {
	// the entity id that caused the change
	var changeId = changes.entityId;
	var phaseChange = changes.changes.phase;
	// the new phase id
	var newValueId = phaseChange.newValue.match(newValueRegex)[1];
	// the original phase id
	var originalValueId = phaseChange.originalValue.match(originalValueRegex)[1];

	// get the logical names
	var newPhaseLogicalName = convertLogicalIdToLogicalName(newValueId);
	var originalPhaseLogicalName = convertLogicalIdToLogicalName(originalValueId);

	// in this example we only do something when the new phase is opened and the original phase was either
	// fixed or closed
	if (newPhaseLogicalName === 'phase.defect.opened' &&
		(originalPhaseLogicalName === 'phase.defect.fixed' || originalPhaseLogicalName === 'phase.defect.closed' )) {
		updateReworkCounter(changeId);
	}
}

function convertLogicalIdToLogicalName(wantedId) {
	return _.find(defectPhases, function(defectPhase) {
		return defectPhase.id === wantedId;
	}).logical_name;
}

// updates a udf on octane
function updateReworkCounter(changeId) {
	octane.authenticate(authentication, function(err) {
		if (err) {
			console.log('Error - %s', err.message);
			return
		}

		// get the defect for the change id
		octane.defects.get({id: changeId}, function(err, defect) {
			//console.log(defect)

			// get the counter from the octane defect
			var reworkCounter = defect.rework_counter_udf;
			if (!reworkCounter) {
				reworkCounter = 0;
			}

			// update the counter by one
			octane.defects.update({id: changeId, rework_counter_udf: ++reworkCounter}, function(err, defect) {
				if (err) {
					console.log('Error - %s', err.message);
					return
				}

				console.log('successfully updated rework counter');
			});
		});
	});
}

module.exports.parsePhaseChange = parsePhaseChange;