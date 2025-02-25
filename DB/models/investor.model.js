import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';
import bcryptjs from 'bcryptjs';

const investorSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      minlength: 3,
      maxlength: 30,
      required: [true, 'investors should have a name'],
      trim: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    age: {
      type: Number,
      required: [true, 'provide your age'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'provide phone number'],
      validate: {
        validator: function (val) {
          return validator.isMobilePhone(val);
        },
        message: 'provide valid mobile phone.',
      },
    },
    email: {
      type: String,
      required: [true, 'investor must have an email'],
      unique: true,
      validate: {
        validator: function (val) {
          return validator.isEmail(val);
        },
        message: 'provide valid email',
      },
    },
    isEmailConfirmed: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, 'investors should provide password.'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'please confirm your password'],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: 'password and passwordConfirm are not the same',
      },
    },
    nationality: {
      type: String,
      required: [true, 'provide your nationality'],
    },
    interests: {
      type: Array,
      validate: {
        validator: function (val) {
          return val.length > 0;
        },
        message: 'you shoud provide at least one interest',
      },
    },
    bio: {
      type: String,
      required: [true, 'provide your Bio'],
    },
    ssn: {
      type: String,
      required: [true, 'provide your SSN'],
      unique: true,
      validate: {
        validator: function (val) {
          const ssnRegex = /^[0-9]{3}-[0-9]{2}-[0-9]{4}$/;
          return validator.matches(val, ssnRegex) && val !== '000-00-0000';
        },
        message: `(VALUE) is not valid SSN`,
      },
    },
    profilePhoto: String,
    role: {
      type: String,
      default: 'investor',
    },
    idCardPhoto: {
      type: String,
      required: [true, 'provide your card photo'],
    },
    taxNumber: {
      type: String,
      required: [true, 'provide your tax number'],
      unique: true,
      validate: {
        validator: function (val) {
          const taxNumberRegex = /^[A-Za-z0-9-]+$/;
          return validator.matches(val, taxNumberRegex);
        },
        message: `your tax number (VALUE) is not valid`,
      },
    },
    points: {
      type: Number,
      default: 0,
      min: [0, 'The gained points should not be below zero'],
    },
    socialLinks: {
      type: Map, // like object js    ex { linkedin : https://kjksjdkc.com}
      of: String, // key of the object
      required: [true, 'provide social links'],
      validate: {
        validator: function (val) {
          return val.size > 0;
        },
        message: 'provide at least one social link',
      },
      default: {},
    },
    organization: [String],
    jobTitle: {
      type: String,
      required: [true, 'provide your job title.'],
    },
    availableBudget: {
      type: Number,
      required: [true, 'provide your available budget'],
      min: [0, 'budget can not be below zero'],
    },
    proofPhoto: {
      type: String,
      required: [true, 'provide your proof photo.'],
    },
    acceptedByAdmin: Boolean,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
  }
);

// encrypt password
investorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcryptjs.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// change passwordChangeAt properity
investorSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// instance method to login
investorSchema.methods.correctPassword = async (
  inputPassword,
  savedPassword
) => {
  return await bcryptjs.compare(inputPassword, savedPassword);
};

// create password reset token
investorSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpires = Date.now() + 10 * 1000 * 60;
  return resetToken;
};

// instance method to check if password change time greater than time for creating token
investorSchema.methods.passwordChangeAfter = function (issuedTimeStamp) {
  if (this.passwordChangedAt) {
    const passwordChangedAtSeconds = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return passwordChangedAtSeconds > issuedTimeStamp;
  }
  return false;
};

export const Investor = mongoose.model('Investor', investorSchema);
