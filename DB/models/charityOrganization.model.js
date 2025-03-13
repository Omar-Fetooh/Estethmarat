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
      enum: [
        'مؤسسة خيرية عامة',
        'جمعية تنموية',
        'منظمة إغاثية وإنسانية',
        'مؤسسة تعليمية غير ربحية',
        'مؤسسة طبية خيرية',
        'منظمة بيئية وتنموية',
        'جمعية لرعاية الأيتام والمسنين',
        'منظمة لدعم ذوي الاحتياجات الخاصة',
        'منظمة دعم المرأة وتمكينها',
        'منظمة للأعمال التطوعية',
        'مؤسسة ثقافية وفنية خيرية',
        'جمعية خيرية اجتماعية',
        'أخرى',
      ],
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
        'دعم التعليم والتدريب',
        'الرعاية الصحية والخدمات الطبية',
        'تمكين المرأة والمساواة',
        'التنمية الاقتصادية والمشاريع الصغيرة',
        'دعم ذوي الهمم',
        'التنمية المستدامة والبيئة',
        'القضاء على الفقر وتحسين المعيشة',
        'توفير المياه والصرف الصحي',
        'المساعدات الإنسانية والإغاثة',
        'الإسكان والبنية التحتية',
        'أخرى',
      ],
    },
    targetedGroups: {
      type: [String],
      required: [true, 'At least one targeted group is required'],
      enum: [
        'أصحاب المشاريع الصغيرة ومتناهية الصغر',
        'الأطفال والشباب',
        'النساء',
        'كبار السن',
        'ذوي الهمم',
        'العائلات ذات الدخل المحدود',
        'اللاجئون والنازحون',
        'المرضى والمحتاجون للرعاية الصحية',
        'المجتمعات الريفية والمناطق الفقيرة',
      ],
    },
    targetedRegions: {
      type: [String],
      required: [true, 'At least one targeted region is required'],
      enum: [
        'دعم محلي (داخل الدولة فقط)',
        'دعم إقليمي (داخل عدة دول في نفس المنطقة)',
        'دعم دولي (في دول متعددة)',
        'المناطق الريفية والمهمشة',
        'المناطق الحضرية والضواحي',
        'المجتمعات المتأثرة بالكوارث والنزاعات',
        'أخرى',
      ],
    },
    supportTypes: {
      type: [String],
      required: [true, 'At least one support type is required'],
      enum: [
        'تمويل مالي مباشر',
        'توفير معدات وموارد أساسية',
        'استشارات قانونية وإدارية',
        'دعم تقني وتكنولوجي',
        'توفير مساحات عمل وخدمات لوجستية',
        'تسويق وترويج',
        'تدريب وتطوير مهارات',
        'برامج شراكات وربط مع جهات داعمة',
        'أخرى',
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
