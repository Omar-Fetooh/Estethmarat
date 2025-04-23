import mongoose, { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { type } from 'os';
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
    role: {
      type: String,
      default: 'charityOrganization',
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
    notification: {
      type: Boolean,
      default: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'email is invalid'],
      required: [true, 'email is required'],
    },
    phoneNumber: { type: String, required: true },
    website: {
      type: String,
      match: [/^https?:\/\/.+/, 'Invalid URL format'],
      required: true,
    },
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
    registrationProof: {
      public_id: { type: String, required: true },
      secure_url: { type: String, required: true },
    },
    country: {
      type: String,
      required: [true, 'Select the country for this company now!'],
      enum: [
        'السعوديه',
        'الإمارات',
        'مصر',
        'الكويت',
        'البحرين',
        'قطر',
        'عمان',
        'الأردن',
        'فلسطين',
        'اليمن',
        'لبنان',
        'الجزائر',
        'المغرب',
        'تونس',
        'ليبيا',
        'السودان',
        'موريتانيا',
        'جيبوتي',
        'جزر_القمر',
        'الصومال',
      ],
    },
    headQuarter: {
      type: String,
      required: [true, 'Please select the head quarter for the company now!'],
      enum: [
        'الرياض',
        'جدة',
        'مكة المكرمة',
        'الدمام',
        'المدينة المنورة',
        'الخبر',
        'الطائف',
        'القصيم',
        'الخرج',
        'تبوك',
        'دبي',
        'أبوظبي',
        'الشارقة',
        'العين',
        'رأس الخيمة',
        'الفجيرة',
        'أم القيوين',
        'الذيد',
        'القاهرة',
        'الإسكندرية',
        'الجيزة',
        'الأقصر',
        'أسوان',
        'طنطا',
        'المنصورة',
        'شرم الشيخ',
        'المحلة الكبرى',
        'الزقازيق',
        'الكويت العاصمة',
        'الفروانية',
        'حولي',
        'الجهراء',
        'مبارك الكبير',
        'الأحمدي',
        'الصور',
        'العديلية',
        'المنامة',
        'المحرق',
        'الحد',
        'سترة',
        'الرفاع',
        'مركز البحرين التجاري',
        'السانبوسة',
        'مدينة عيسى',
        'الدوحة',
        'الريان',
        'الوكرة',
        'الخور',
        'مسيعيد',
        'الشیحانیة',
        'أم صلال',
        'الزبارة',
        'مسقط',
        'صلالة',
        'نزهة',
        'نزوى',
        'البريمي',
        'صحار',
        'الرستاق',
        'مطرح',
        'بهلاء',
        'عمان',
        'إربد',
        'الزرقاء',
        'السلط',
        'عجلون',
        'الكرك',
        'معان',
        'مادبا',
        'الطفيلة',
        'القدس',
        'رام الله',
        'غزة',
        'نابلس',
        'بيت لحم',
        'الخليل',
        'جنين',
        'أريحا',
        'طولكرم',
        'قلقيلية',
        'صنعاء',
        'عدن',
        'تعز',
        'المكلا',
        'المعلا',
        'إب',
        'الحديدة',
        'لحج',
        'الضالع',
        'ذمار',
        'بيروت',
        'طرابلس',
        'صيدا',
        'صور',
        'بعلبك',
        'زحلة',
        'جبيل',
        'النبطية',
        'المتن',
        'كسروان',
        'الجزائر العاصمة',
        'وهران',
        'قسنطينة',
        'عنابة',
        'المدية',
        'تلمسان',
        'سيدي بلعباس',
        'البليدة',
        'الشلف',
        'ورقلة',
        'الرباط',
        'الدار البيضاء',
        'مراكش',
        'فاس',
        'طنجة',
        'أكادير',
        'العيون',
        'تطوان',
        'مكناس',
        'الجدية',
        'تونس العاصمة',
        'سوسة',
        'صفاقس',
        'قابس',
        'المنستير',
        'المهدية',
        'قصر هلال',
        'قليبية',
        'نابل',
        'بنزرت',
        'طرابلس',
        'بنغازي',
        'مصراتة',
        'البيضاء',
        'الزاوية',
        'طرابلس',
        'درنة',
        'سبها',
        'الخمس',
        'سرت',
        'الخرطوم',
        'أم درمان',
        'الخرطوم بحري',
        'مدني',
        'بورتسودان',
        'الأبيض',
        'كوستي',
        'كادقلي',
        'دنقلا',
        'نيالا',
        'نواكشوط',
        'نواديبو',
        'كيفة',
        'الزويرات',
        'نواكشوط الجنوبية',
        'ألاك',
        'بوتلميت',
        'الشيخ',
        'جيبوتي العاصمة',
        'علي سبيح',
        'تخوتا',
        'سمحة',
        'مخا',
        'مريسي',
        'موروني',
        'فومبوني',
        'موتسامودو',
        'دوموني',
        'بامبي',
        'ويوني',
        'مقديشو',
        'هرجيسا',
        'بوصاصو',
        'جروي',
        'كيسمايو',
        'بلدوين',
        'بيدوا',
        'طوسمريب',
        'شكوشو',
      ],
    },
    acceptNotifications: {
      type: Boolean,
      default: false,
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
  {
    timestamps: true,
  }
);
charityOrganizationSchema.pre('validate', function (next) {
  this.projectTypes = [...JSON.parse(this.projectTypes)];
  this.targetedGroups = [...JSON.parse(this.targetedGroups)];
  this.targetedRegions = [...JSON.parse(this.targetedRegions)];
  this.supportTypes = [...JSON.parse(this.supportTypes)];
  next();
});

charityOrganizationSchema.pre('save', async function (next) {
  // ask for if password has been modified or not
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
// change passwordChangeAt properity
charityOrganizationSchema.pre('save', function (next) {
  if (!this.isModified('password') || !this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// instance method to login
charityOrganizationSchema.methods.correctPassword = async (
  inputPassword,
  savedPassword
) => {
  return await bcrypt.compare(inputPassword, savedPassword);
};

// create password reset token
charityOrganizationSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpires = Date.now() + 10 * 1000 * 60;
  return resetToken;
};
// check if the user change password after issued jwt or not
charityOrganizationSchema.methods.passwordChangeAfter = function (
  issuedTimeStamp
) {
  if (this.passwordChangedAt) {
    const passwordChangedAtSeconds = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return passwordChangedAtSeconds > issuedTimeStamp;
  }
  return false;
};

export const CharityOrganization =
  mongoose.models.CharityOrganization ||
  model('CharityOrganization', charityOrganizationSchema);
