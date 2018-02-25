var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var expressJwt = require('express-jwt');
var config = require('./config.json');

var index = require('./routes/index');
var users = require('./routes/users');
var usersQuestionnaires = require('./routes/users-questionnaires');
var adminQuestionnaires = require('./routes/admin-questionnaires');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors({origin: '*'}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressJwt({
	secret: config.secret,
	getToken: function (req) {
		if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
			return req.headers.authorization.split(' ')[1];
		}
		else if(req.query && req.query.token) {
			return req.query.token;
		}
		return null;
	}
}).unless({ path: ['/users/authenticate', '/users/register'] }));

app.use('/', index);
app.use('/users', users);
app.use('/users-questionnaires', usersQuestionnaires);
app.use('/admin-questionnaires', adminQuestionnaires);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


