/*
 * © Copyright 2018-2020 Micro Focus or one of its affiliates.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Octane = require('@microfocus/alm-octane-js-rest-sdk').Octane;
const fs = require('fs');
const configuration = JSON.parse(fs.readFileSync('configuration.json', 'utf8'));

// read configuration from file
const octane = new Octane(configuration);

// called when a phase is changed
function parsePhaseChange(data) {
    return new Promise((resolve, reject) => {
        // the entity id that caused the change
        const changeId = data.entity.id;
        const phaseChange = data.changes.phase;
        // the new phase id
        const newValueId = phaseChange.newValue.id;
        // the original phase id
        const originalValueId = phaseChange.oldValue.id;

        console.log('Requesting change for defect %d', changeId);
        // in this example we only do something when the new phase is opened and the original phase was either
        // fixed or closed
        if (newValueId === 'phase.defect.opened' &&
            (originalValueId === 'phase.defect.fixed' || originalValueId === 'phase.defect.closed')) {
            updateReworkCounter(changeId).then(() => {
                resolve();
            }).catch(err => {
                reject(err);
            })
        } else {
            console.log('Defect %d not being changed', changeId);
            resolve();
        }
    });

}

// updates a udf on octane
async function updateReworkCounter(changeId) {
    try {
        const defect = await octane
            .get(Octane.entityTypes.defects)
            .at(changeId)
            .fields('rework_counter_udf')
            .execute();
        //console.log(defect)

        // get the counter from the octane defect
        defect.rework_counter_udf = (defect.rework_counter_udf || 0) + 1;

        // update the counter by one
        let updatedDefect = await octane
            .update(Octane.entityTypes.defects, defect)
            .execute();
        console.log('successfully updated rework counter for defect %s', defect.id);
        return updatedDefect;
    } catch (err) {
        console.log('Error - %s', JSON.stringify(err.message));
        throw {message: JSON.stringify(err.message), status: err.code};
    }
}

module.exports.parsePhaseChange = parsePhaseChange;