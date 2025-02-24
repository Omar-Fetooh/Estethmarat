// import crypto from 'crypto';
// import jwt from 'jsonwebtoken';
// import { errorHandler } from '../../middlewares/error-handling.middleware.js';
// import { AppError } from '../Utils/index.js';
// import { Investor } from '../../DB/models/index.js';
// import { sendEmail } from './../Utils/sendEmail.js';

// export const createTokenAndSendCookie = (id, res) => {
//   // create token
//   const token = jwt.sign({ id }, process.env.SECRET_KEY, {
//     expiresIn: process.env.EXPIRES_IN,
//   });
//   // some options for cookie
//   const options = {
//     expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
//     httpOnly: true,
//   };
//   // add secure in production
//   if (process.env.NODE_ENV === 'production') options.secure = true;
//   // save token in cookie
//   res.cookie('jwt', token, options);
//   return token;
// };

// // login
// export const login = errorHandler(async (req, res, next) => {
//   // console.log(req.originalUrl)
//   // 1) ensure email and password in req.body
//   const { email, password } = req.body;
//   if (!email || !password)
//     return next(new AppError('please provide email and password', 400));
//   // 2) get investor based on email from database
//   const investor = await Investor.findOne({ email }).select('+password');
//   // 3) check if input password mathing one in database
//   if (
//     !investor ||
//     !(await investor.correctPassword(password, investor.password))
//   )
//     return next(new AppError('email or password are not correct', 400));
//   // 4) login and send token
//   const token = createTokenAndSendCookie(investor._id, res);
//   // hide password from response
//   investor.password = undefined;
//   res.status(200).json({
//     status: 'success',
//     data: {
//       investor,
//       token,
//     },
//   });
// });

// // forgot password
// export const forgotPassword = errorHandler(async (req, res, next) => {
//   // 1) get email
//   const { email } = req.body;
//   if (!email) return next(new AppError('please provide your email', 400));
//   // 2) get user base on email
//   const investor = await Investor.findOne({ email });
//   if (!investor)
//     return next(new AppError('there is no investor with that email', 400));
//   // 3) generate password reset token
//   const resetToken = investor.createPasswordResetToken();
//   console.log(resetToken);
//   // save changes
//   await investor.save({ validateBeforeSave: false });
//   // reset url
//   const resetUrl = `${req.protocol}://${req.get(
//     'host'
//   )}/api/v1/investors/resetPassword/${resetToken}`;
//   // mail options
//   const mailOptions = {
//     email: investor.email,
//     subject: 'password reset token valid for 10 minutes',
//     message: `forgot your password? submit patch request with new password and passwordConfirm to: ${resetUrl}.\nif you did't forgot your password please ignore this email`,
//     html: `<p> welcome to Estethmart.com </p>`,
//   };
//   // send email
//   await sendEmail(mailOptions);
//   res.status(200).json({
//     status: 'success',
//     message: 'email has been sent successfully',
//   });
// });

// // reset password
// export const resetPassword = errorHandler(async (req, res, next) => {
//   // 1) get investor based on token
//   const resetToken = req.params.token;
//   const hashedToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');
//   const investor = await Investor.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetTokenExpires: { $gt: Date.now() },
//   });
//   if (!investor || !resetToken)
//     return next(new AppError('invalid token or has been expired', 400));
//   // 2) update password and passwordConfirm
//   investor.password = req.body.password;
//   investor.passwordConfirm = req.body.passwordConfirm;
//   investor.passwordResetToken = undefined;
//   investor.passwordResetTokenExpires = undefined;
//   await investor.save();
//   // 3) update password changedat properity
//   // done by pre save hook
//   // 4) login user and send token
//   const token = createTokenAndSendCookie(investor._id, res);
//   res.status(200).json({
//     status: 'success',
//     message: 'password has been updated successfully',
//     token,
//   });
// });

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
