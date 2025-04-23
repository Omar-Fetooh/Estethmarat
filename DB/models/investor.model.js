import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';
import bcryptjs from 'bcryptjs';
import { type } from 'os';

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
      required: [true],
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
      type: [String],
      enum: {
        values: [
          'الذكاء الاصطناعي والتعلم الآلي',
          'البرمجيات كخدمة (SaaS) والتطبيقات',
          'التكنولوجيا المالية (Forgch) والمدفوعات الرقمية',
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
          'رأس المال الجريء (Venture Capital) والاستثمارات الناشئة',
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
        message: 'You should select at least one of the investment fields',
      },
      required: [true, 'please provide your investment fields'],
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
    profilePhoto: {
      type: String,
      required: [true, 'provide your profile photot'],
    },
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
      type: String,
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
    notification: {
      type: Boolean,
      default: true,
      required: [true, 'Do you accept notification ?'],
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
investorSchema.pre('validate', function (next) {
  this.investmentfields = [...JSON.parse(this.investmentfields)];
  next();
});
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
