const jwt = require('jsonwebtoken');
const AsyncHandler = require('../middleware/AsyncHandler');
const ErrorResponse = require('../middleware/ErrorResponse');
const User = require('../models/User');

// @desc        Register new user
// @route       POST /api/v1/auth/register
// @access      Private
exports.register = AsyncHandler(async (req, res, next) => {
  // Deconstruct information from body
  const {
    displayname,
    email,
    password,
    role,
    permissions,
    dealership
  } = req.body;

  // Create new user
  const user = await User.create({
    displayname,
    email,
    password,
    role,
    permissions,
    dealership
  });

  sendTokenResponse(user, 200, res);
});

// @desc        Login existing user
// @route       POST /api/v1/auth/login
// @access      Public
exports.login = AsyncHandler(async (req, res, next) => {
  // Deconstruct email and password from body
  const {
    email,
    password
  } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and a password', 400));
  }

  // Validate user exists
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 200));
  }

  // Validate right password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 200));
  }

  sendTokenResponse(user, 200, res);
});

// @desc        Verify if the token in the cookies is still active
// @route       GET /api/v1/auth/verify
// @access      Public
exports.verify = AsyncHandler(async (req, res, next) => {
  // Get the token from the request cookies
  const token = req.cookies.authToken;

  // Make sure token exists
  if (!token) {
    return res.status(200).json({ success: false });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(200).json({ success: false, error: err });
  }
});

// @desc        Logout user and clear auth cookie
// @route       GET /api/v1/auth/logout
// @access      Private
exports.logout = AsyncHandler(async (req, res, next) => {
  res.cookie('authToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })

  res.status(200).json({
    success: true,
    data: {}
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create user jwt token
  const authToken = user.getSignedJwtToken();
  // Create cookie
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 1000 * 60),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('authToken', authToken, options).json({ success: true, authToken });
}