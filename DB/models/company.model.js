import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const companySchema = new mongoose.Schema({
  recommendation_id: {
    type: Number,
    unique: true,
  },
  registrationNumber: {
    type: String,
    unique: true,
    required: [true, 'Please enter the regestiration number for this company!'],
  },
  taxIdNumber: {
    type: String,
    unique: true,
  },
  representativeName: {
    type: String,
    required: [true, 'Enter the representative name for the company!'],
  },
  representativeEmail: {
    type: String,
    require: [true, 'Please enter your email now!'],
    validate: [
      validator.isEmail,
      'Please enter a valid email for this company!',
    ],
  },
  nationalId: {
    type: String,
    required: [true, 'Please enter the your national id now!'],
    unique: true,
  },
  investmentAmount: {
    type: Number,
    required: [true, 'Please enter the investment amount!'],
    min: 0,
  },
  currency: {
    type: String,
    enum: {
      values: [
        '(EGP) جنيه مصري',
        '(USD) دولار أمريكي',
        '(EUR) يورو',
        '(SAR) ريال سعودي',
        '(AED) درهم إماراتي',
      ],
      message: '{VALUE} is not defined select one!',
    },
    required: [true, 'select your currency!'],
    default: 'EGP',
  },
  sharePercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  activeClients: {
    type: Number,
    required: [true, 'Enter the active number of clients!'],
    default: 0,
    min: 0,
  },
  fundingPurpose: {
    type: String,
    required: [true, 'Enter the purpose for funding in details!'],
    trim: true,
    minlength: 20,
  },
  annualRevenue: {
    type: String,
    min: 0,
    required: [true, 'Enter the annual revenue for this company!'],
  },
  netProfit: {
    type: String,
    required: [true, 'Enter the net profit number!'],
    default: 0,
  },
  percentageProfitMargin: {
    type: Number,
    required: [true, 'Enter the percentage for ProfitMargin!'],
    default: 0,
  },
  breakEvenPoint: {
    type: Date,
    required: [true, 'Enter the break Even Point!'],
  },
  financialReportPDF: {
    type: String,
    required: [true, 'Upload the pdf for financial report!'],
  },
  requiredServices: {
    type: Object,
    required: [true, 'Enter the required services of this company!'],
  },
  exitStrategy: {
    type: String,
    required: [true, 'Select the exit strategy for this company!'],
  },
  expectedProfitPerYear: {
    type: String,
    required: [true, 'Enter expected Profit PerYear'],
  },
  risksAndDifficults: {
    type: String,
    required: [true, 'Enter the risks and difficulties for this company!'],
  },
  companyDescription: {
    type: String,
    maxlength: [
      500,
      'long description respect the rules (max length 500 characters!)',
    ],
    required: [
      true,
      'Please enter your notes for your company in 500 words as a maximum length!',
    ],
  },
  businessModel: {
    type: String,
    enum: {
      values: [
        'B2B',
        'B2C',
        'B2B2C',
        'C2C',
        'Marketplace',
        'SaaS',
        'B2G',
        'أخرى',
      ],
      message:
        "{VALUE} is not defined please select from these values only (['B2C', 'B2B', 'B2B2C', 'D2C'])",
    },
    required: [true, 'Please select your businessModel'],
  },
  targetMarket: {
    type: String,
    enum: {
      values: [
        'السوق المحلي',
        'الشرق الأوسط وشمال إفريقيا',
        'أفريقيا',
        'أوروبا',
        'آسيا',
        'أمريكاالشمالية',
        'أمريكا الجنوبية',
        'استراليا وأوقيانوسيا',
        'عالمي',
        'أخرى',
      ],
      message: 'Select value from select box',
    },
    required: [true, 'Please select one value!'],
  },
  offeredServices: {
    type: String,
    required: [true, 'Enter the offered services'],
  },
  currentClerksNumber: {
    type: String,
    required: [true, 'Select the number of current clerks from select box!'],
    enum: {
      values: ['5-10', '10-20', '20-40', '40-60', 'اكثر من ذلك'],
      message: 'Select value from this select box!',
    },
  },
  foundationDate: {
    type: Date,
    required: [true, 'Enter the foundation date now!'],
  },
  partnerShip: {
    type: String,
    required: [true],
  },
  videoLink: {
    type: String,
    required: [true],
  },
  companyName: {
    type: String,
    required: [true, 'Enter the name for this company here!'],
    trim: true,
    maxlength: [35, 'A company name must be less or equal 40 characters'],
    minlength: [2, 'A company name must be greater or equal 10 characters'],
  },
  socialName: {
    type: String,
    required: [true, 'Please enter the social name for this company here!'],
    trim: true,
  },
  companyField: {
    type: [String],
    enum: {
      values: [
        'الذكاء الاصطناعي والتعلم الآلي',
        'البرمجيات كخدمة (SaaS) والتطبيقات',
        'التكنولوجيا المالية (FinTech) والمدفوعات الرقمية',
        'الأمن السيبراني وحماية البيانات',
        'البلوكتشين والعملات الرقمية',
        'إنترنت الأشياء (IoT) والأتمتة الذكية',
        'الواقع الافتراضي والمعزز (VR/AR)',
        'الحوسبة السحابية وتحليل البيانات الضخمة',
        'الروبوتات والأنظمة الذكية',
        'التجارة الإلكترونية والمتاجر الرقمية',
        'التجزئة والماركات التجارية',
        'الخدمات اللوجستية والتوصيل',
        'إدارة سلاسل الإمداد والتوزيع',
        'السياحة والسفر والفنادق',
        'إدارة الفعاليات والترفيه',
        'التأمين والخدمات المالية',
        'التطوير العقاري السكني والتجاري',
        'المدن الذكية والبنية التحتية الرقمية',
        'تقنيات البناء والهندسة المعمارية',
        'المقاولات والتشييد',
        'إدارة الممتلكات وصناديق العقارات',
        'التصنيع الذكي والروبوتات الصناعية',
        'السيارات الكهربائية وتقنيات التنقل الذكي',
        'الطباعة ثلاثية الأبعاد والتصنيع المبتكر',
        'الصناعات الثقيلة والمعدات الهندسية',
        'الصناعات الكيميائية والبتروكيماويات',
        'الإلكترونيات وأشباه الموصلات',
        'الطاقة المتجددة (الطاقة الشمسية، الرياح، الهيدروجين الأخضر)',
        'إدارة النفايات وإعادة التدوير',
        'تحلية المياه ومعالجة المياه الذكية',
        'الكفاءة الطاقية وحلول الاستدامة',
        'النفط والغاز والطاقة التقليدية',
        'الزراعة الذكية والتكنولوجيا الزراعية (AgriTech)',
        'إنتاج وتصنيع الأغذية والمشروبات',
        'الأمن الغذائي والاستدامة الزراعية',
        'الاستزراع السمكي والموارد البحرية',
        'تقنيات الأسمدة والمبيدات الحيوية',
        'الأدوية والتكنولوجيا الحيوية (BioTech)',
        'الأجهزة الطبية والتقنيات العلاجية',
        'الرعاية الصحية الرقمية والتطبيب عن بُعد ',
        'الذكاء الاصطناعي في الطب وتحليل البيانات الصحية',
        'الطب التجديدي والعلاج الجيني',
        'صناعة المحتوى الرقمي والإعلام الجديد',
        'ألعاب الفيديو والرياضات الإلكترونية',
        'السينما والإنتاج الإعلامي',
        'البث المباشر ومنصات الفيديو',
        'الصحافة الرقمية والإعلام التفاعلي',
        'تكنولوجيا التعليم (EdTech) والتعلم الإلكتروني',
        'الجامعات والمراكز البحثية',
        'التدريب المهني وتنمية المهارات',
        'الذكاء الاصطناعي في التعليم',
        'ريادة الأعمال والاستثمار',
        'رأس المال الجريء (Venture Capital) الاستثمارات الناشئة',
        'الأسهم والأسواق المالية',
        'العقارات والصناديق الاستثمارية',
        'القروض والتمويل الجماعي',
        'العملات الرقمية والاستثمار اللامركزي (DeFi)',
        'الطيران وتقنيات الفضاء',
        'المواصلات الذكية والبنية التحتية للطرق',
        'الشحن والنقل البحري',
        'القطارات والمترو وأنظمة النقل الجماعي',
        'الأزياء والملابس',
        'مستحضرات التجميل والعناية الشخصية',
        'المنتجات المنزلية والإلكترونية',
        'المجوهرات والساعات الفاخرة',
        'الأدوية البيطرية والتكنولوجيا البيطرية',
        'مستلزمات الحيوانات الأليفة',
        'مزارع الإنتاج الحيواني الحديثة',
        'الأجهزة الطبية المساعدة',
        'البرمجيات والتقنيات الموجهة لذوي الاحتياجات الخاصة',
        'إمكانية الوصول الرقمي والتصميم الشامل',
      ],
      message: 'Select valid value from select box!',
    },
    required: [true, 'Select the field for this company now!'],
  },
  state: {
    type: String,
    required: [true, 'Please select the state for this company now!'],
    enum: {
      values: [
        'Pre-Seed (النماذج الأولية)',
        'Seed (مرحلة التأسيس والتمويل الأولي)',
        'Series A (التوسع الأولي)',
        'Series B (التوسع والنمو السريع)',
        'Late Stage / IPO (ما قبل الطرح العام)',
      ],
      message: 'Select valid value from select box!',
    },
  },
  companyPhoto: {
    type: String,
    required: [true],
  },
  email: {
    type: String,
    required: [true, 'Enter a valid email for this company now!'],
    validate: [validator.isEmail, 'Invalid email please enter valid one now!'],
    unique: true,
  },
  companyPhoneNumber: {
    type: String,
    required: [true, 'Please enter the phone for this company now!'],
    match: [
      /^\+\d{6,15}$/,
      'Phone number must start with "+" and be 6 to 15 digits long',
    ],
  },
  websiteUrl: {
    type: String,
    required: [true, 'Enter the url website for this company!'],
  },
  country: {
    type: String,
    required: [true, 'Select the country for this company now!'],
    enum: {
      values: [
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
      message: 'Select one value from the select box!',
    },
  },
  headQuarter: {
    type: String,
    required: [true, 'Please the head quarter for the company now!'],
    enum: {
      values: [
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
      message: 'Select the headQuarter for your compant now!',
    },
  },
  bmc: {
    type: String,
    required: [true, 'upload the bmc for this company!'],
  },
  password: {
    type: String,
    required: [true, 'Please enter password for company'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    // required: [true, 'please enter your password again here!'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: `You should enter the same password!,This value:{VALUE} is not the same`,
    },
  },
  role: {
    type: String,
    default: 'company',
  },
  notification: {
    type: Boolean,
    default: true,
    required: [true, 'Please select the notification for this company!'],
  },
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  passwordChangedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  savedProfiles: [
    {
      profileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'savedProfiles.profileType',
      },
      profileType: {
        type: String,
        required: true,
        enum: [
          'Investor',
          'CharityOrganization',
          'SupportOrganization',
          'Company',
        ],
      },
    },
  ],
});
companySchema.pre('validate', function (next) {
  if (this.isNew) {
    this.companyField = [...JSON.parse(this.companyField)];
    this.requiredServices = { ...JSON.parse(this.requiredServices) };
  }
  next();
});
companySchema.pre('save', async function (next) {
  const companies = await Company.find();
  this.recommendation_id = companies.length + 1;
  next();
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
companySchema.methods.passwordChangeAfter = function (issuedTimeStamp) {
  if (this.passwordChangedAt) {
    const passwordChangedAtSeconds = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return passwordChangedAtSeconds > issuedTimeStamp;
  }
  return false;
};
export const Company = mongoose.model('Company', companySchema);
