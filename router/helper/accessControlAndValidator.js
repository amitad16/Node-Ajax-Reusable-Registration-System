// Access Control
let ifLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    // console.log(req);
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
    // console.log(req.originalUrl);
    if (req.originalUrl.split('/')[3] === 'users') {
      let username = req.originalUrl.split('/')[4];
      res.redirect(`/users/${username}`);
    } else {
      res.json({ error: 'Route Error' });
    }
  }
};

module.exports = {
  ifLoggedIn,
  ifNotLoggedIn
};