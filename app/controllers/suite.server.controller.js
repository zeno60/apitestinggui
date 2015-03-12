var mongoose = require('mongoose');
var APITestSuite = mongoose.model('APITestSuite');

exports.renderSuiteList = function(req, res, next) {
    res.render('suite', {
        title: 'RENDER SUITES'
    });
};

exports.getSuiteList = function(req, res, next) {
    APITestSuite.find({}, function(err, testSuites) {
        var suiteMap = [];

        testSuites.forEach(function(testSuite) {
            suiteMap.push(testSuite);
        });

        res.json(suiteMap);
    });
}