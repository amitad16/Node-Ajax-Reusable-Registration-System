// Access Control
let ifLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error', 'You are not authorized to view that page.');
    res.redirect('/user/login');
  }
};

let ifNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error', 'You are not authorized to view that page.');
    if (req.originalUrl.split('/')[3] === 'users') {
      res.redirect(`/users/${req.user.username}`);
    } else {
      res.redirect(`/users/${req.user.username}`);
    }
  }
};

module.exports = {
  ifLoggedIn,
  ifNotLoggedIn
};