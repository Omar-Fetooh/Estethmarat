import mongoose, { Schema, model } from 'mongoose';

const charityOrganizationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
      minLength: 3,
      maxLength: 50,
      unique: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      unique: true,
    },
    organizationType: {
      type: String,
      required: [true, 'Organization type is required'],
      enum: ['Charity', 'Non-Profit', 'Foundation', 'Other'],
    },
    image: {
      public_id: { type: String, required: true },
      secure_url: { type: String, required: true, unique: true },
    },
    customId: {
      type: String,
      required: true,
      unique: true,
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
    projectTypes: {
      type: [String],
      required: [true, 'At least one project type is required'],
      enum: [
        'Education and Training',
        'Healthcare and Medical Services',
        'Women Empowerment',
        'Economic Development',
        'Support for People with Disabilities',
        'Sustainable Development and Environment',
        'Poverty Alleviation',
        'Water and Sanitation',
        'Humanitarian Aid',
        'Housing and Infrastructure',
        'Other',
      ],
    },
    targetedGroups: {
      type: [String],
      required: [true, 'At least one targeted group is required'],
      enum: [
        'Small Business Owners',
        'Children and Youth',
        'Women',
        'Elderly',
        'People with Disabilities',
        'Low-Income Families',
        'Refugees and Displaced Persons',
        'Patients in Need of Healthcare',
        'Rural Communities',
      ],
    },
    targetedRegions: {
      type: [String],
      required: [true, 'At least one targeted region is required'],
      enum: [
        'Local Support',
        'Regional Support',
        'International Support',
        'Rural and Marginalized Areas',
        'Urban and Suburban Areas',
        'Disaster and Conflict-Affected Communities',
        'Other',
      ],
    },
    supportTypes: {
      type: [String],
      required: [true, 'At least one support type is required'],
      enum: [
        'Financial Support',
        'Providing Equipment and Essential Resources',
        'Legal and Administrative Consulting',
        'Technical and Technological Support',
        'Providing Workspaces and Logistical Services',
        'Marketing and Promotion',
        'Training and Skills Development',
        'Partnership Programs and Networking',
        'Other',
      ],
    },
    commercialRegistrationNumber: {
      type: String,
      required: [true, 'Commercial registration number is required'],
      unique: true,
    },
    taxIdNumber: {
      type: String,
      required: [true, 'Tax ID number is required'],
      unique: true,
    },
    representativeName: {
      type: String,
      required: [true, 'Representative name is required'],
    },
    representativeEmail: {
      type: String,
      required: [true, 'Representative email is required'],
      lowercase: true,
      match: [/.+\@.+\..+/, 'Please enter a valid email address'],
    },
    representativeNationalId: {
      type: String,
      required: [true, 'Representative national ID is required'],
      unique: true,
    },
    // registrationProof: {
    //   public_id: { type: String, required: true },
    //   secure_url: { type: String, required: true },
    // },
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
  {
    timestamps: true,
  }
);

export const CharityOrganization =
  mongoose.models.CharityOrganization ||
  model('CharityOrganization', charityOrganizationSchema);
