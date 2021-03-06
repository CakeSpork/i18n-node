/**
 * This example is intended to show a cookie usage in express setup
 * with jade template engine and also to be run
 * as integration test for concurrency issues.
 *
 * Please remove setTimeout(), if you intend to use it as a blueprint!
 *
 */

// require modules
var express = require('express'),
    i18n = require('../../i18n'),
    url = require('url'),
    jade = require('jade'),
    app = module.exports = express();

// minimal config
i18n.configure({
  locales: ['en', 'fr'],
  cookie: 'locale',
  directory: __dirname + '/locales'
});

app.configure(function () {
  // setup hbs
  app.set('views', "" + __dirname + "/views");
  app.set('view engine', 'jade');

  // you'll need cookies
  app.use(express.cookieParser());

  // init i18n module for this loop
  app.use(i18n.init);

});

// delay a response to simulate a long running process,
// while another request comes in with altered language settings
app.get('/', function (req, res) {
  setTimeout(function () {
    res.render('index');
  }, app.getDelay(req, res));
});

// set a cookie to requested locale
app.get('/:locale', function (req, res) {
  res.cookie('locale', req.params.locale);
  res.redirect("/?delay=" + app.getDelay(req, res));
});

// simple param parsing
app.getDelay = function (req, res) {
  return url.parse(req.url, true).query.delay || 0;
};

// startup
app.listen(3000);
