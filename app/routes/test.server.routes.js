module.exports = function(app) {
    var test = require('../controllers/test.server.controller');

    app.route('/test')
        .get(test.renderTestList)
        .post(test.create);

    app.route('/test/:testId')
        .get(test.getTestById)
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