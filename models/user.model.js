const mongoose = require('mongoose');
const { Schema }= mongoose;
const bcrypt = require('bcryptjs');
const titlize = require('mongoose-title-case');
const validate = require('mongoose-validator');

const SALT_WORK_FACTOR = 10;

const nameValidator = [
  validate({
    validator: 'matches',
    arguments: /^([a-zA-Z ]){3,50}$/,
    message: 'Should be 3-50 char long, no special characters or numbers.'
  })
];

const emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'Invalid Email'
  })
];

const usernameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 20],
    message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
  }),
  validate({
    validator: 'isAlphanumeric',
    message: 'Username should contain letters or numbers only'
  })
];

const passwordValidator = [
  validate({
    validator: 'matches',
    arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[\W]).{6,18}$/,
    message: 'Password needs to have at least one lower case, one upper case, one number, one special character,' +
    'and must be at least 6 characters and at most 18.'
  })
];

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    validate: nameValidator
  },
  username: {
    type: String,
    required: true,
    unique: true,
    validate: usernameValidator
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: emailValidator
  },
  password: {
    type: String,
    required: true,
    validate: passwordValidator
  },
  profileImg: {
    type: Schema.Types.Mixed,
    required: false
  },
  resetToken: {
    type: String,
    required: false
  }
});

UserSchema.plugin(titlize, {
  paths: [ 'name' ],
  trim: true
});

UserSchema.pre('save', function (next) {
  let user = this;

  if (user.isModified('password')) {
    user.password = hashPassword(user);
    next();
  } else {
    next();
  }
});

UserSchema.statics.findByCredentials = function (username, callback) {
  let User = this;

  const query = { username: username };
  User.findOne(query, callback);
};

UserSchema.statics.getUserById = function (id, parameters, callback) {
  let User = this;
  User.findById(id, parameters, callback);
};

// Helper functions ***************************************************************
// Hash password
let hashPassword = (user) => {
  let salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  return bcrypt.hashSync(user.password, salt);
};

// Compare the password during login
UserSchema.statics.comparePassword = (userPassword, hash, callback) => {
  bcrypt.compare(userPassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };
