"use strict";

var express = require('express'),
	path    = require('path'),
	router  = express.Router();

var Index = require('../controllers/Index');

/* GET home page. */
router.get('/', function(req, res) {
	Index.render(res);
});

router.get('/tpb', function(req, res) {
	Index.tpb(res);
});

// router.get('/search/:keywords', function(req, res) {
// 	TheTVDB.search(req.params.keywords).then(function(series) {
// 		res.render('search', {
// 			title: "Search",
// 			content: series
// 		});
// 	});
// });

// http://www.thetvdb.com/wiki/index.php?title=API:GetSeries

module.exports = router;