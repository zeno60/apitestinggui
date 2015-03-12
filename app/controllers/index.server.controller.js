var APITest = require('mongoose').model('APITest');

exports.render = function(req, res) {
    res.render('index', {
        title: 'MEAN MVC'
    });
};

exports.get = function(req, res) {
    APITest.find({}, function(err, places) {
        res.json(places[0]);
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