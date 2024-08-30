var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./middleware/jwtMiddleware');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

var app = express();

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOURL||"mongodb+srv://harikrishnan123:Ci5wxDxk77liZxdO@init.lekb52w.mongodb.net/?retryWrites=true&w=majority&appName=init")
.then( ()=> {console.log("Database connected")})
.catch(err=>{console.log(`Error in database connection: ${err}`)})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));


app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
