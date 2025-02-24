import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { type } from 'os';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Enter the name of company'],
    trim: true,
    maxlength: [40, 'A company name must be less or equal 40 characters'],
    minlength: [10, 'A company name must be greater or equal 10 characters'],
  },
  companyMembers: {
    type: Number,
    required: [
      true,
      'A company should has members, Enter the number of members',
    ],
    min: 0,
    default: 7,
  },
  businessStage: {
    type: String,
    required: [true, 'Please enter the stage for your company!'],
    enum: {
      values: ['Idea', 'Seed', 'Startup', 'Growth', 'Expansion', 'Mature'],
      message:
        '{VALUE} is not defined, please choose the stage from these only ("Idea", "Seed", "Startup", "Growth", "Expansion", "Mature")',
    },
    default: 'Idea',
  },
  companyLocation: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number],
  },
  services: {
    type: [String],
    required: [true, 'You should enter at least one service for this company!'],
  },
  category: {
    type: String,
    required: [true, 'Please enter the track of your company'],
  },
  aboutUS: {
    type: String,
    default: 'we are a purposeful company!',
    trim: true,
  },
  targetAudience: {
    type: String,
    required: [true, 'Please enter the target audience for your company'],
    trim: true,
  },
  Revenue: {
    type: Number,
    min: 0,
    default: 0,
  },
  grossProfit: {
    type: Number,
    min: 0, // as we can't accept negative value( this.Revenue - this.goodsGross)
    default: 0,
  },
  allgoods: {
    type: Number,
    min: 0,
    default: 0,
  },
  netProfits: {
    type: Number, //this.Revenue - this.allGross
    min: 0,
    default: 0,
  },
  offer: {
    description: {
      type: String,
      required: [true, 'Enter the description for this offer'],
    },
    validFrom: {
      type: Date,
      required: [true, 'Enter the start date for this offer'],
    },
    validUntil: {
      type: Date,
      required: [true, 'Enter the last date for this offer'],
    },
  },
  financialPerformance: {
    revenue: {
      type: Number, // Total revenue
      required: [true, 'Enter the total number for revenue'],
    },
    grossProfit: {
      type: Number, // Profit after subtracting the cost of goods sold (COGS)
      required: [true, 'Enter the grossProfit here'],
    },
    netProfit: {
      type: Number, // Profit after all operating expenses, taxes, interest, etc.
      required: [true, 'Enter the net profit'],
    },
    expenses: {
      type: Number, // Total expenses incurred by the company
      required: true,
    },
    profitMargin: {
      type: Number, // Calculated as (Net Profit / Revenue) * 100
    },
    totalInvestment: {
      type: Number,
    },
    returnOnInvestment: {
      type: Number, // ROI: (Net Profit / Total Investment) * 100
    },
    year: {
      type: Number,
      required: [true, 'Enter the year for financial performance'],
    },
  },
  foundedDate: {
    type: Date,
    required: [true, 'Please Enter the founded date for this company'],
  },
  logoImage: String,
  needs: [
    {
      resource: {
        type: String,
        required: [true, 'Enter your need'],
      },
      description: {
        type: String,
        required: [true, 'Enter the description for this need to be clear'],
      },
      urgencyLevel: {
        type: String,
        required: [true, 'Enter the level of urgencyLevel for this need'],
        enum: {
          values: ['low', 'medium', 'high'],
          message:
            '{VALUE} is not defined choose form these only (["low", "medium", "high"])',
        },
      },
    },
  ],
  email: {
    type: String,
    required: [true, 'Please enter the email for this company'],
    validate: [validator.isEmail, 'Invalid email please enter valid one'],
    unique: true,
  },
  websiteLink: {
    type: String,
    required: [true, 'Enter a valid website link for this company'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter password for company'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please enter your password again here!'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: `You should enter the same password!,This value:{VALUE} is not the same`,
    },
  },
  partnerShip: [
    {
      partnerShipName: {
        type: String,
        required: [true, 'Please enter the name for partnerShip'],
      },
      status: {
        type: String,
        enum: {
          values: ['active', 'unactive'],
          message:
            '{VALUE} is not defined enter value from this values ("active", "unactive")',
        },
        required: [true, 'Enter the status'],
      },
      partnerShipDate: {
        type: Date,
        required: [true, 'Enter the date for this relation'],
      },
    },
  ],
  capital: String,
  videoUrl: String,
  acceptedByAdmin: Boolean,
  businessIncubators: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  legalRepresentativeID: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "founder",
    //   required: [
    //     true,
    //     "Please enter the person who is responsable for this company",
    //   ],
    type: String,
  },
  companyDocs: [String],
  companyFounder: {
    type: String,
    required: [true, 'Enter the name of the company'],
    trim: true,
  },
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  passwordChangedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

companySchema.pre('save', async function (next) {
  // ask for if password has been modified or not
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
// change passwordChangeAt properity
companySchema.pre('save', function (next) {
  if (!this.isModified('password') || !this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// instance method to login
companySchema.methods.correctPassword = async (
  inputPassword,
  savedPassword
) => {
  return await bcrypt.compare(inputPassword, savedPassword);
};

// create password reset token
companySchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpires = Date.now() + 10 * 1000 * 60;
  return resetToken;
};
// check if the user change password after issued jwt or not
companySchema.methods.changePasswordAfter = function (jwtIssuedAt) {
  if (this.passwordChangedAt) {
    const changeAt = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return changeAt > jwtIssuedAt;
  }
  return false;
};
export const Company = mongoose.model('Company', companySchema);
