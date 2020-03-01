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
const express = require('express');
const router = express.Router();
const octane = require('../src/octane');

/* POST endpoint for the CALLURL */
router.post('/', function (req, res, next) {
    if (req.query.test) {
        res.sendStatus(200);
    } else {
        octane.parsePhaseChange(req.body.data[0]).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            next(err);
        });
    }
});

module.exports = router;