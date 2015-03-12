module.exports = function(app) {
    var suite = require('../controllers/suite.server.controller');

    app.route('/suiteview')
        .get(suite.renderSuiteList);

    app.route('/suite')
        .get(suite.getSuiteList);

    /*
    app.route('/test')
        .post(index.create)
        .get(index.get);

    app.route('/suite')
        .get(index.renderCreateSuite)
        .post(index.createSuite);

    app.route('/suite/:suiteId')
        .get(index.getSuiteById);
        */
};