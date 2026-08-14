const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      minlength: 6,
      select: false,
    },
    googleId: {
      type: String,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    role: {
      type: String,
      enum: ['super_admin', 'teacher', 'student', 'parent'],
      default: 'student',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    },
    phone: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active',
    },
    // Super Admin OTP 2FA Security Fields
    otpHash: {
      type: String,
      select: false,
    },
    otpExpires: {
      type: Date,
      select: false,
    },
    otpAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    otpLastSentAt: {
      type: Date,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt before save if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
