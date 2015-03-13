var mongoose = require('mongoose');
var APITestSuite = mongoose.model('APITestSuite');

exports.renderSuiteList = function(req, res, next) {
    var responseFormat = req.query.responseFormat;

    if(responseFormat == 'json') {
        APITestSuite.find({}, function(err, testSuites) {
            var suiteMap = [];

            testSuites.forEach(function(testSuite) {
                suiteMap.push(testSuite);
            });

            res.json(suiteMap);
        });
    }
    else {
        res.render('suite', {
            title: 'RENDER SUITES'
        });
    }
};

exports.renderSuite = function(req, res, next) {
    var responseFormat = req.query.responseFormat;
    var suiteId = req.params.suiteId;

    if(responseFormat == 'json') {
        APITestSuite.findById(suiteId, function(err, testSuite) {
            res.json(testSuite);
        });
    }
    else {
        res.render('singlesuite', {
            title: 'SINGLE SUITE',
            suiteId: suiteId
        });
    }
};

exports.getSuiteList = function(req, res, next) {
    APITestSuite.find({}, function(err, testSuites) {
        var suiteMap = [];

        testSuites.forEach(function(testSuite) {
            suiteMap.push(testSuite);
        });

        res.json(suiteMap);
    });
};

exports.create = function(req, res, next) {
    var apiTestSuite = new APITestSuite(req.body);
    apiTestSuite.save(function(err) {
        if (err) {
            return next(err);
        }
        else {
            res.json(apiTestSuite);
        }
    });
};

exports.getSuiteById = function(req, res, next) {
    var suiteId = req.params.suiteId;
    APITestSuite.findById(suiteId, function(err, testSuite) {
        res.json(testSuite);
    });
};