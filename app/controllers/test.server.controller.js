var mongoose = require('mongoose');
var APITest = mongoose.model('APITest');

exports.renderTestList = function(req, res, next) {
    res.render('test', {
        title: 'RENDER TESTS'
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

exports.remove = function(req, res, next) {
    var testId = req.params.testId;

    APITest.findById(testId).remove(function() {
        res.status(204).send();
    });
};

exports.getTestList = function(req, res, next) {
    APITest.find({}, function(err, tests) {
        var testMap = [];

        tests.forEach(function(test) {
            testMap.push(test);
        });

        res.json(testMap);
    });
}