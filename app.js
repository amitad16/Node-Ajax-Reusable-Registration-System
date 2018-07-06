require('./server/config/config');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const logger = require('morgan');

const port = process.env.PORT;

// Route Files
const indexRouter = require('./router/index');
const userRouter = require('./router/user');
const usersRouter = require('./router/users');

// App initialize
const app = express();

// View Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Logger
// app.use(logger('dev'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set static directory
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Init Passport
app.use(passport.initialize());
app.use(passport.session());

// Express messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*', function(req,res,next) {
  //local variable to hold user info
  res.locals.user = req.user ||  null;
  next();
});

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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

app.listen(port, () => console.log(`Listening to port ${port}`));
