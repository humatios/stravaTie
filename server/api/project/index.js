'use strict';

import * as auth from '../../auth/auth.service';
var express = require('express');
var controller = require('./project.controller');

var router = express.Router();

router.get('/me', controller.stravaMe);
router.get('/route', controller.stravaRoute);
router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
