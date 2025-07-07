import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';
import bcryptjs from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Estethmarat.com',
  },
  email: {
    type: String,
    required: [true, 'admin must have an email'],
    unique: true,
    validate: {
      validator: function (val) {
        return validator.isEmail(val);
      },
      message: 'provide valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'admin should provide password.'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    // required: [true, 'please confirm your password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'password and passwordConfirm are not the same',
    },
  },
  role: {
    type: String,
    default: 'admin',
  },
  photo: {
    type: String,
  },
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  passwordChangedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// encrypt password
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcryptjs.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// change passwordChangeAt properity
adminSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// instance method to login
adminSchema.methods.correctPassword = async (inputPassword, savedPassword) => {
  return await bcryptjs.compare(inputPassword, savedPassword);
};

// create password reset token
adminSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpires = Date.now() + 10 * 1000 * 60;
  return resetToken;
};

// instance method to check if password change time greater than time for creating token
adminSchema.methods.passwordChangeAfter = function (issuedTimeStamp) {
  if (this.passwordChangedAt) {
    const passwordChangedAtSeconds = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return passwordChangedAtSeconds > issuedTimeStamp;
  }
  return false;
};
export const Admin = mongoose.model('Admin', adminSchema);
