import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { json } from 'stream/consumers';
const { Schema, model } = mongoose;

const organizationSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
      required: [true, 'name is required'],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'email is invalid'],
      required: [true, 'email is required'],
    },
    password: {
      type: String,
      trim: true,
      minLength: 6,
      required: [true, 'password is required'],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    websiteUrl: {
      type: String,
      match: [/^https?:\/\/.+/, 'Invalid URL format'],
    },
    typeOfOrganization: {
      type: String,
      enum: ['Charities', 'BusinessIncubators'],
      required: [true, 'type of organization is required'],
    },
    bankAccountNumber: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: [true, 'phone Number is required'],
    },
    supportedCompanies: {
      type: [String],
      ref: 'Company',
    },
    sector: {
      type: String,
    },
    description: {
      type: String,
      minLength: 20,
      required: true,
    },
    registerationNumber: {
      type: String,
    },
    budget: {
      type: String,
    },
    fields: {
      type: [String],
    },
    legalRepresentativeId: {
      type: String,
    },
    // companyDocs:{  TODO
    //     type:
    // },
    // fundResources, TODO
    // logoImage: {
    //   secure_url: {
    //     type: String,
    //     required: true,
    //   },
    //   public_id: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //   },
    // },
    // customId: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    acceptedByAdmin: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isMarkedAsDeleted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    passwordChangedAt: Date,
  },
  { timestamps: true }
);

// for frequently queried fields for better performance
// organizationSchema.index({ email: 1 });
// organizationSchema.index({ typeOfOrganization: 1, location: 1 });
// change passwordChangeAt properity
// encrypt password

organizationSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcryptjs.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

organizationSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// instance method to login
organizationSchema.methods.correctPassword = async (
  inputPassword,
  savedPassword
) => {
  return await bcryptjs.compare(inputPassword, savedPassword);
};

// create password reset token
organizationSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpires = Date.now() + 10 * 1000 * 60;
  return resetToken;
};

// instance method to check if password change time greater than time for creating token
organizationSchema.methods.passwordChangeAfter = function (issuedTimeStamp) {
  if (this.passwordChangedAt) {
    const passwordChangedAtSeconds = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return passwordChangedAtSeconds > issuedTimeStamp;
  }
  return false;
};

export const Organization =
  mongoose.models.Organization || model('Organization', organizationSchema);
