import { Schema, model } from 'mongoose';

const supportOrganizationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    username: { type: String, required: true, unique: true },
    organizationType: {
      type: String,
      required: true,
      enum: [
        'Business Incubator',
        'Startup Accelerator',
        'Innovation Hub',
        'Venture Capital Firm',
        'Crowdfunding Platform',
        'Bank/Financial Institution',
        'Government Organization/Economic Authority',
        'Other',
      ],
    },
    image: {
      secure_url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
        unique: true,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'email is invalid'],
      required: [true, 'email is required'],
    },
    phoneNumber: { type: String, required: true },
    website: { type: String, match: [/^https?:\/\/.+/, 'Invalid URL format'] },
    location: { type: String, required: true },
    password: { type: String, required: true, trim: true, minLength: 6 },
    supportedProjectFields: [{ type: String, required: true }],
    supportedProjectsCount: { type: Number, default: 0 },
    targetFundingValue: { type: Number, required: true },
    supportTypes: [
      {
        type: String,
        required: true,
        enum: [
          'Funding and Investment',
          'Financial and Banking Support',
          'Legal and Administrative Consulting',
          'Business Development and Strategic Planning',
          'Training and Mentorship',
          'Government Grants and Facilities',
          'Technical Development and Technological Support',
          'Operational and Logistics Support',
          'Incubators and Co-Working Spaces',
          'Marketing and Promotion',
          'Other',
        ],
      },
    ],
    targetedProjectStages: [
      {
        type: String,
        required: true,
        enum: [
          'Pre-Seed (Prototype Stage)',
          'Seed (Founding and Initial Funding)',
          'Series A (Early Expansion)',
          'Series B (Expansion and Rapid Growth)',
          'Late Stage / IPO (Pre-Public Offering)',
        ],
      },
    ],
    providedPrograms: [{ type: String }],
    commercialRegistrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    taxIdNumber: { type: String, required: true },
    representativeName: { type: String, required: true },
    representativeEmail: { type: String, required: true },
    representativeNationalId: { type: String, required: true },
    bankAccountNumber: { type: String, required: true },
    sector: { type: String, required: true },
    description: { type: String },
    registrationNumber: { type: String, required: true, unique: true },
    companyDoc: { type: String }, // URL to the company document
    fundResources: [{ type: String }],
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

export const SupportOrganization =
  mongoose.models.SupportOrganization ||
  model('SupportOrganization', supportOrganizationSchema);
