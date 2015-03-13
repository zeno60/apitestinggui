module.exports = function(app) {
    var suite = require('../controllers/suite.server.controller');

    app.route('/suite')
        .get(suite.renderSuiteList)
        .post(suite.create);

    app.route('/suite/:suiteId')
        .get(suite.renderSuite);

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