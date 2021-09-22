const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please select a name'],
    minlength: 1,
    maxlength: 55
  },
  email: {
    type: String,
    required: [true, 'Please select a email'],
    unique: true,
    minlength: 1,
    maxlength: 255,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    type: String
  },
  password: {
    type: String,
    required: [true, 'please select a password'],
    minlength: 8,
    maxlength: 1024
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please select a password'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
