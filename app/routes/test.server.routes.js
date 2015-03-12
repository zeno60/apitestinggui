module.exports = function(app) {
    var test = require('../controllers/test.server.controller');

    app.route('/testview')
        .get(test.renderTestList);

    app.route('/test')
        .get(test.getTestList)
        .post(test.create);

    app.route('/test/:testId')
        .delete(test.remove);

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