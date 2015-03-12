module.exports = function(app) {
    var index = require('../controllers/index.server.controller');
    app.get('/', index.render);

    /*app.route('/test')
        .post(index.create)
        .get(index.get);

    app.route('/suite')
        .get(index.renderCreateSuite)
        .post(index.createSuite);

    app.route('/suite/:suiteId')
        .get(index.getSuiteById);*/
};