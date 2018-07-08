/**
 * Configuration file
 * Setting environment variables
 */
require('./server/config/config');

// Requiring dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const path = require('path');

// Setting port using environment variable initialized @{config.js} file
const port = process.env.PORT;

// Route handler files
const indexRouter = require('./router/index');
const userRouter = require('./router/user/user');
const usersRouter = require('./router/users/users');
const usersSettingsRouter = require('./router/users/settings/settings');
const usersSettingsAccountRouter = require('./router/users/settings/account/account');

/**
 * Express App initialized
 * @type {*|Function}
 */
const app = express();

// Configuration of view engine and directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/**
 * Setting middleware
 */
// Cookie parser Middleware
app.use(cookieParser());

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
/**
 * End setting middleware
 */

app.get('*', function(req,res,next) {
  //local variable to hold user info
  res.locals.user = req.user ||  null;
  next();
});

/**
 * Initializing routes
 */
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/users', usersRouter);
app.use('/users/:username/settings', usersSettingsRouter);
app.use('/users/:username/settings/account', usersSettingsAccountRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Run the app
app.listen(port, () => console.log(`Listening to port ${ port }`));
