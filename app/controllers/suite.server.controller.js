var mongoose = require('mongoose');
var APITestSuite = mongoose.model('APITestSuite');
var APITest = mongoose.model('APITest');
var http = require('http');
var httpurl = require('url');

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
        returnField = returnField.replace(new RegExp(keyField, 'g'), variables[key]);
    });

    return returnField;
};

exports.executeSuite = function(req, res, next) {
    var suiteId = req.params.suiteId;

    APITestSuite.findById(suiteId, function(err, suite) {

        var testSuite = suite.toObject();
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

            url = httpurl.parse(url);

            var request = {
                hostname: url.hostname,
                port: url.port,
                path: url.path,
                method: test.httpMethod,
                headers: test.headers
            };

            var assertResponse = function(data, status, headers) {

                if(test.variables !== undefined && test.variables.output !== undefined) {
                    Object.keys(test.variables.output).forEach(function (key) {
                        var tempData = data;
                        var split = test.variables.output[key].split('.');
                        for (var i = 0; i < split.length; i++) {
                            tempData = tempData[split[i]];
                        }

                        testOutputVariables[key] = tempData;
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
                        var tempData = data;
                        var split = assertion.responseBodyParameter.split('.');
                        for (var i = 0; i < split.length; i++) {
                            tempData = tempData[split[i]];
                        }

                        if(tempData != assertion.expectedValue) {
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

                testSuite.tests[testCount-1] = test;

                if(testCount < maxTests) {
                    APITest.findById(testSuite.tests[testCount]._id, function(err, test) {
                        executeTest(test.toObject());
                    });
                }
                else {
                    res.json(testSuite);
                }
            }

            var httpRequest = http.request(request, function(response) {
                response.on('data', function(data) {

                    // todo: do some checks here on response header being application/json since we are explicitly using JSON.parse() below
                    var responseContentType = response.headers['content-type'];
                    if(responseContentType.indexOf('application/json') != -1) {
                        assertResponse(JSON.parse(data), response.statusCode, response.headers);
                    }
                });
            });

            httpRequest.on('error', function(error) {
                console.log(error);
            });

            httpRequest.end();
        };

        if(testCount < maxTests) {
            APITest.findById(testSuite.tests[testCount]._id, function(err, test) {
                executeTest(test.toObject());
            });
        }
    });
};