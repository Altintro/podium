var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Stablish connection to database
require('./lib/connectMongoose');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname ,'../public','images')));

app.use('/', require('./routes/index'));
app.use('/apiv1/users', require('./routes/apiv1/users'));
app.use('/apiv1/tournaments',require('./routes/apiv1/tournaments'))
app.use('/apiv1/games', require('./routes/apiv1/games'))
app.use('/apiv1/sports', require('./routes/apiv1/sports'))


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
  // res.render('error');
  console.log(err.message)
  res.json({ message: err.message, status: res.status })
});

module.exports = app;
