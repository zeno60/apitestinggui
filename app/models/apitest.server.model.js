var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var APITestSchema = new Schema({
    url: String,
    httpMethod: String,
    headers: { },
    variables: {
        input: {},
        output: {}
    },
    assertions: Array
});

mongoose.model('APITest', APITestSchema);