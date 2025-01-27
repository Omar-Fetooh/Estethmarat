import mongoose from "mongoose";
const { Schema, model } = mongoose;

const organizationSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "email is invalid"],
      required: [true, "email is required"],
    },
    password: {
      type: String,
      trim: true,
      minLength: 6,
      required: [true, "password is required"],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    websiteUrl: {
      type: String,
      match: [/^https?:\/\/.+/, "Invalid URL format"],
    },
    typeOfOrganization: {
      type: String,
      enum: ["Charities", "BusinessIncubators"],
      required: [true, "type of organization is required"],
    },
    bankAccountNumber: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: [true, "phone Number is required"],
    },
    supportedCompanies: {
      type: [String],
      ref: "Company",
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
    logoImage: {
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
    customId: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
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
  },
  { timestamps: true }
);

// for frequently queried fields for better performance
// organizationSchema.index({ email: 1 });
// organizationSchema.index({ typeOfOrganization: 1, location: 1 });

export const Organization =
  mongoose.models.Organization || model("Organization", organizationSchema);
