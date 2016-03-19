"use strict";

var express = require('express'),
	path    = require('path'),
	router  = express.Router();

var APIJson = require('../api/json');

router.get('/serie/info/:id', function(req, res) {
	APIJson.getSerieInfo(res, req.params.id);
});

module.exports = router;