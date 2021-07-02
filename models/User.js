const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  displayname: {
    type: String,
    required: [true, 'User display name is a required field']
  },
  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please use a valid email'
    ],
    required: [true, 'User email is a required field'],
    unique: true
  },
  role: {
    type: String,
    enum: ['management', 'sales', 'reception', 'maintenance']
  },
  dealership: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dealership',
    required: true
  },
  permissions: {
    type: [String],
    enum: [
      'add_vehicle',
      'update_vehicle',
      'delete_vehicle',
      'view_vehicle',
      'add_location',
      'view_location',
      'update_location',
      'delete_location',
      'update_vehicle_location',
      'create_user',
      'update_user',
      'delete_user'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 6,
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrype password using BCrypt before registering a new user
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, displayname: this.displayname, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

// Match user password to hashed password in database
UserSchema.methods.matchPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
}

module.exports = mongoose.model('User', UserSchema);