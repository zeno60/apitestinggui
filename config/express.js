var config = require('./config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session');

module.exports = function() {
    var app = express();

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: 'OurSuperSecretCookieSecret'
    }));

    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    require('../app/routes/index.server.routes.js')(app);
    app.use(express.static('./public'));

    return app;
};