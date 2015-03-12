var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var APITestSchema = new Schema({
    testName: String,
    url: String,
    httpMethod: String,
    headers: { },
    variables: {
        input: {},
        output: {}
    },
    assertions: Array
});

var APITestSuiteSchema = new Schema({
    suiteName: String,
    tests: [Schema.Types.ObjectId]
});

mongoose.model('APITest', APITestSchema);
mongoose.model('APITestSuite', APITestSuiteSchema);