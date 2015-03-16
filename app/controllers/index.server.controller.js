var mongoose = require('mongoose');
var APITest = mongoose.model('APITest');
var APITestSuite = mongoose.model('APITestSuite');

exports.render = function(req, res) {
    res.render('index', {
        title: 'MEAN MVC'
    });
};

exports.get = function(req, res) {
    APITest.find({}, function(err, tests) {
        var testMap = [];

        tests.forEach(function(test) {
            testMap.push({id: test._id, name: test.testName});
        });

        res.json(testMap);
    });
};

exports.create = function(req, res, next) {
    var apiTest = new APITest(req.body);
    apiTest.save(function(err) {
        if (err) {
            return next(err);
        }
        else {
            res.json(apiTest);
        }
    });
};

exports.createSuite = function(req, res, next) {
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

exports.renderCreateSuite = function(req, res, next) {

    res.render('suite', {
        title: 'CREATE SUITE'
    });
};

exports.getSuiteById = function(req, res, next) {
    var suiteId = req.params.suiteId;
    APITestSuite.findById(suiteId, function(err, testSuite) {
        res.json(testSuite);
    });
};

exports.getTestEndpoint = function(req, res, next) {
    res.json({
        person: {
            firstName: 'kevin',
            lastName: 'jamieson'
        },
        field: 'test'
    })
}