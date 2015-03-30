var port = 1337;

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/config');
var mongoose = require('./config/mongoose');
var express = require('./config/express');

var db = mongoose();
var app = express();

var server = app.listen(config.port);

module.exports = app;
console.log(process.env.NODE_ENV  + ' server https://github.com/zeno60/apitestingguirunning at http://localhost:' + config.port);