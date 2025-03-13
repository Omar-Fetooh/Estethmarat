import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';
import bcryptjs from 'bcryptjs';

const investorSchema = new mongoose.Schema(
  {
    fullArabicName: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: [true, 'investors should have a name'],
      trim: true,
    },
    fullEnglishName: {
      type: String,
      minlength: 3,
      maxlength: 50,
      required: [true, 'investors should have a name'],
      trim: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
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

    investmentfields: {
      type: Array,
      validate: {
        validator: function (val) {
          return val.length > 0;
        },
        message: 'you shoud provide at least one field',
      },
    },
    investmentStage: {
      type: String,
      enum: {
        values: [
          'Pre-Seed',
          'Seed',
          'Series A',
          'Series B',
          'Late Stage / IPO',
          'All the mentions',
        ],
        message: `your stage {VALUE} must be from these ['Pre-Seed' , 'Seed' , 'Series A' , 'Series B' , 'Late Stage / IPO' , 'All the mentions']`,
      },
      required: [true, 'please provide your investment stage'],
    },

    idNumber: {
      type: String,
      unique: true,
      required: [
        true,
        'please provide your national id number or passport number',
      ],
      validate: {
        validator: function (value) {
          const nationalId = /^[0-9]{8,18}$/;
          const passwortId = /^[A-Z0-9]{6,9}$/;
          return nationalId.test(value) || passwortId.test(value);
        },
        message: `Invalid ID. Must be a valid National ID (8-18 digits) based on your country or Passport Number (6-9 alphanumeric characters).`,
      },
    },
    investmentLicenseNumber: {
      type: String,
      unique: true,
      required: [true, 'please tell us your investment license number'],
      match: /^[A-Z0-9-]{8,20}$/,
      minlength: [8, 'investmentLicenseNumber must not below 8 characters'],
      maxlength: [20, 'investmentLicenseNumber must not above 20 characters'],
    },
    profilePhoto: String,
    role: {
      type: String,
      default: 'investor',
    },

    points: {
      type: Number,
      default: 0,
      min: [0, 'The gained points should not be below zero'],
    },

    organization: {
      type: [String],
      required: [true, 'please provide your orginzation!'],
    },
    jobTitle: {
      type: String,
      required: [true, 'provide your job title.'],
    },
    availableBudget: {
      type: Number,
      required: [true, 'provide your available budget'],
      min: [0, 'budget can not be below zero'],
    },
    currency: {
      type: String,
      enum: {
        values: ['EGP', 'USD', 'EUR', 'SAR', 'AED'],
        message: `your curreny {VALUE} must be from ['EGP' , 'USD' , 'EUR' , 'SAR', 'AED']`,
      },
      required: [true, 'please provide currency'],
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
