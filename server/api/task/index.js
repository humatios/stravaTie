'use strict';

import * as auth from '../../auth/auth.service';
var express = require('express');
var controller = require('./task.controller');

var router = express.Router();

router.get('/start/:id', auth.isAuthenticated(), controller.start);
router.get('/stop/:id', auth.isAuthenticated(), controller.stop);

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
