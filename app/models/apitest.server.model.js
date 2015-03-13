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
    body: {},
    assertions: Array
});

var APITestSuiteSchema = new Schema({
    suiteName: String,
    variables: {
        global: {}
    },
    tests: [
        {
            _id: Schema.Types.ObjectId,
            testName: String
        }
    ]
});

mongoose.model('APITest', APITestSchema);
mongoose.model('APITestSuite', APITestSuiteSchema);