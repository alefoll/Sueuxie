"use strict";

var express = require('express'),
    router  = require('./routes');

var app = express();

app.engine('jsx', require('express-react-views').createEngine())
   .set('view engine', 'jsx')
   .use(express.static('public'))
   .use('/data', express.static('data'))
   .use('/', router.main)
   .use('/json', router.json)
   .use('/my', router.my)
   .listen(8000);