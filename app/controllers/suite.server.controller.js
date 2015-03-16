var mongoose = require('mongoose');
var APITestSuite = mongoose.model('APITestSuite');
var APITest = mongoose.model('APITest');
var http = require('http');

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

var resolveInputVariables = function(field, variables) {
    var returnField = field;

    Object.keys(variables).forEach(function(key) {
        var keyField = '\{' + key + '\}';
        returnField = returnField.replace(new RegExp(keyField, 'g'), value);
    });

    return returnField;
};

exports.executeSuite = function(req, res, next) {
    var suiteId = req.params.suiteId;

    APITestSuite.findById(suiteId, function(err, testSuite) {

        var testOutputVariables = {};
        var maxTests = testSuite.tests.length;
        var testCount = 0;

        var executeTest = function(test) {
            testCount++;

            var url = test.url;

            if(!(test.variables === undefined) && !(test.variables.input === undefined)) {
                url = resolveInputVariables(test.url, test.variables.input);
            }

            if(!(testSuite.variables === undefined) && !(testSuite.variables.global === undefined)) {
                url = resolveInputVariables(url, testSuite.variables.global);
            }

            url = resolveInputVariables(url, testOutputVariables);

            if(test.headers !== undefined) {
                Object.keys(test.headers).forEach(function (header) {
                    var headerValue = test.headers[header];

                    if (test.variables !== undefined && test.variables.input !== undefined) {
                        headerValue = resolveInputVariables(headerValue, test.variables.input);
                    }

                    if (testSuite.variables !== undefined && testSuite.variables.global !== undefined) {
                        headerValue = resolveInputVariables(headerValue, testSuite.variables.global);
                    }

                    test.headers[header] = headerValue;
                });
            }

            var request = {
                hostname: url,
                method: test.httpMethod,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': '*'
                }
            };

            var assertResponse = function(data, status, headers, config) {

                if(test.variables !== undefined) {
                    Object.keys(test.variables.output).forEach(function (key) {

                        var tempData = data;
                        var split = test.variables.output[key].split('.');
                        for (var i = 0; i < split.length; i++) {
                            tempData = tempData[split[i]];
                        }

                        test.variables.output[key] = tempData;
                    });
                }

                var testFailed = false;

                for(var i = 0; i < test.assertions.length; i++) {
                    var assertion = test.assertions[i];
                    var assertionFailed = false;

                    assertion.status = "running";

                    if(assertion.type == 'responseCode') {
                        if(assertion.expectedResponseCode != status) {
                            assertionFailed = true;
                            assertion.error = "expected response code did not match";
                        }
                    }
                    else if(assertion.type == 'responseBody') {
                        if(data[assertion.responseBodyParameter] != assertion.expectedValue) {
                            assertionFailed = true;
                            assertion.error = "response body parameter did not match";
                        }
                    }

                    if(assertionFailed) {
                        testFailed = true;
                        assertion.status = "failed";
                    }
                    else {
                        assertion.status = "passed";
                    }
                }

                if(testFailed) {
                    test.testStatus = "failed";
                }
                else {
                    test.testStatus = "passed";
                }

                if(testCount < maxTests) {
                    executeTest($scope.testSuite.tests[testCount]);
                }
            }

            $http(request).success(assertResponse).error(assertResponse);

            var httpRequest = http.request(request, function(response) {
                console.log('request ' + testCount);
            });

            httpRequest.end();
        }

        if(testCount < maxTests) {
            executeTest(testSuite.tests[testCount]);
        }

        /*testSuite.tests.forEach(function (test) {
            APITest.findById(test._id, function(err, test) {
                var url = test.url;



                var request = {
                    hostname: 'www.google.com',
                    method: 'GET'
                };

                var req = http.request(request, function(response) {
                    console.log('response ' + response.statusCode);
                });

                req.on('error', function(error) {
                    console.log('problem: ' + error.message);
                });

                req.end();
            });
        });*/
    });

    res.send('hello');
};