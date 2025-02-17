import crypto from "crypto";
import { Company } from "../../DB/models/index.js";
import { AppError } from "../Utils/index.js";
import { errorHandler } from "./../middlewares/index.js";
import { sendEmail } from "../Utils/sendEmail.js";
import jwt from "jsonwebtoken";

// function that create jwt
export const createJwtAndSendCookie = function (res, company) {
  // options for cookie
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  // if in production we should make it secure at https
  if (process.env.NODE_ENV === "production") options.secure = true;
  // create token
  const token = jwt.sign({ id: company.id }, process.env.JWT_SECRET_STRING, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
  // create cookie
  res.cookie("jwt", token, options);
  return token;
};
// function for login
export const login = errorHandler(async (req, res, next) => {
  // 1) check if email or password come from body
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  // 2) get the company based on it's email and check the password comen form body request with the pass at db
  const company = await Company.findOne({ email }).select("+password");
  if (
    !company ||
    !(await company.compareTwoPasswords(password, company.password))
  ) {
    return next(new AppError("Email or password incorrect", 400));
  }
  // 3) send token to that company
  const token = createJwtAndSendCookie(res, company);
  // hide the password from response
  company.password = undefined;
  res.status(200).json({
    status: "success",
    data: {
      company,
      token,
    },
  });
});
// function for forget password
export const forgotPassword = errorHandler(async (req, res, next) => {
  // 1) check about email at first
  if (!req.body.email)
    return next(new AppError("Please provide your email at first", 400));
  // 2) get the company based on email
  const company = await Company.findOne({ email: req.body.email });
  if (!company) return next(new AppError("Invalied email try again", 400));
  // 3) create password reset token
  const resetToken = await company.createPasswordResetToken();
  // create resetUrl
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/companies/resetPassword/${resetToken}`;
  // create an object for sending email
  const mailOptions = {
    email: company.email,
    subject: "Password Reset Token is valied for only ten minutes",
    message: `Forgot password? submit a patch request with new password and confirm password to ${resetUrl} and\n if you didn't forget your password ignore this email`,
    html: `<p>welcome to Esteehmarat.com</p>`,
  };
  // send email
  await sendEmail(mailOptions);
  // 4) send respone
  res.status(200).json({
    status: "success",
    message: "Email has been sent successfully",
  });
});
// resetPassword
export const resetPassword = errorHandler(async (req, res, next) => {
  // 1) get the company based on the reset token
  const resetToken = req.params.token;
  const hasedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const company = await Company.findOne({
    passwordResetToken: hasedResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) if the token hasn't expired and there is a company , set a new password
  if (!resetToken || !company)
    return next(new AppError("Invalid token or has been expired", 400));
  (company.password = req.body.password),
    (company.passwordConfirm = req.body.passwordConfirm);
  company.passwordResetToken = undefined;
  company.passwordResetExpires = undefined;
  // 3) update the PasswordChangedAt properity before saving
  await company.save();
  // 4) send respone with the new jwt
  const token = createJwtAndSendCookie(res, company);
  res.status(200).json({
    status: "success",
    message: "password has been updated successfully",
    token,
  });
});
// logout
export const logout = errorHandler(async (req, res, next) => {
  // create new token to override the previous one
  const token = jwt.sign({ id: "anwartarek" }, process.env.JWT_SECRET_STRING, {
    expiresIn: 1,
  });
  // put the created jwt at the place of previous one to override it
  res.cookie("jwt", token, {
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    message: "logged out successfully",
  });
});
