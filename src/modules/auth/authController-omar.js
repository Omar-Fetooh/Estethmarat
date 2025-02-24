import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { errorHandler } from '../../middlewares/index.js';
import { AppError, sendEmail } from '../../Utils/index.js';
import { Organization, Company, Investor } from '../../../DB/models/index.js';

export const createTokenAndSendCookie = (id, res) => {
  // create token
  const token = jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });
  // some options for cookie
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  // add secure in production
  if (process.env.NODE_ENV === 'production') options.secure = true;
  // save token in cookie
  res.cookie('jwt', token, options);
  return token;
};

// login
export const login = errorHandler(async (req, res, next) => {
  // console.log(req.originalUrl)
  // 1) ensure email and password in req.body
  const { email, password, type } = req.body;
  if (!email || !password)
    return next(new AppError('please provide email and password', 400));
  // 2) get investor based on email from database

  let user;
  if (type === 'Investor') {
    user = await Investor.findOne({ email }).select('+password');
  } else if (type === 'Company') {
    user = await Company.findOne({ email }).select('+password');
  } else if (type === 'Organization') {
    user = await Organization.findOne({ email });
  }

  // 3) check if input password mathing one in database
  if (!user || !bcrypt.compareSync(password, user.password))
    return next(new AppError('User not exist or wrong password', 404));

  // 4) login and send token
  const token = createTokenAndSendCookie(user._id, res);

  // hide password from response
  user.password = undefined;
  res.status(200).json({
    status: 'success',
    data: {
      user,
      token,
    },
  });
});

// forgot password
export const forgotPassword = errorHandler(async (req, res, next) => {
  // 1) get email
  const { email, type } = req.body;
  if (!email) return next(new AppError('please provide your email', 400));

  // 2) get user base on email

  let user;
  if (type === 'Investor') {
    user = await Investor.findOne({ email });
  } else if (type === 'Company') {
    user = await Company.findOne({ email });
  } else if (type === 'Organization') {
    user = await Organization.findOne({ email });
  }

  if (!user) return next(new AppError('there is no user with that email', 400));

  // 3) generate password reset token
  const resetToken = user.createPasswordResetToken();
  console.log(resetToken);
  // save changes
  await user.save({ validateBeforeSave: false });
  // reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetPassword/${resetToken}`;
  // mail options
  const mailOptions = {
    email: user.email,
    subject: 'password reset token valid for 10 minutes',
    message: `forgot your password? submit patch request with new password and passwordConfirm to: ${resetUrl}.\nif you did't forgot your password please ignore this email`,
    html: `<p> welcome to Estethmart.com </p>`,
  };
  // send email
  await sendEmail(mailOptions);
  res.status(200).json({
    status: 'success',
    message: 'email has been sent successfully',
  });
});

// reset password
export const resetPassword = errorHandler(async (req, res, next) => {
  const { type, password, passwordConfirm } = req.body;

  if (!type || !password || !passwordConfirm) {
    return next(
      new AppError('Please provide type, password, and passwordConfirm', 400)
    );
  }

  // Check if password and confirm password match
  if (password !== passwordConfirm) {
    return next(new AppError('Passwords do not match', 400));
  }

  // Select the correct model based on user type
  let UserModel;
  if (type === 'Investor') {
    UserModel = Investor;
  } else if (type === 'Company') {
    UserModel = Company;
  } else if (type === 'Organization') {
    UserModel = Organization;
  } else {
    return next(new AppError('Invalid user type', 400));
  }

  // 1) Hash the token from the URL
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // 2) Find the user by the hashed token and check expiration time
  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, // Ensure token is still valid
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // 3) Update password & remove reset token fields
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 4) Generate a new authentication token and send it in a cookie
  const token = createTokenAndSendCookie(user._id, res);

  res.status(200).json({
    status: 'success',
    message: 'Password has been reset successfully',
    token,
  });
});

// // logout
// export const logout = errorHandler(async (req, res, next) => {
//   // console.log(req.cookies);
//   // create random token
//   const token = jwt.sign({ name: 'kareemtarek' }, process.env.SECRET_KEY, {
//     expiresIn: 1,
//   });
//   console.log(token);
//   // override old jwt with new jwt in cookie
//   res.cookie('jwt', token, {
//     httpOnly: true,
//   });
//   res.status(200).json({
//     status: 'success',
//     message: 'logged out successfully',
//   });
// });
