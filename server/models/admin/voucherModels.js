import mongoose from 'mongoose';
const VoucherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Voucher code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  discount: {
    type: Number,
    required: [true, 'Discount amount is required'],
    validate: {
      validator: function (value) {
        if (this.type === 'percentage') {
          return value >= 1 && value <= 100;
        }
        return value >= 1; // No max for fixed
      },
      message: function (props) {
        if (this.type === 'percentage') {
          return 'Percentage discount must be between 1 and 100';
        }
        return 'Fixed discount must be at least 1';
      }
    }
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  minPurchase: {
    type: Number,
    default: 0
  },
  maxUsage: {
    type: Number,
    default: null
  },
  usageCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  usedBy: [
    {
      email: { type: String },
      count: { type: Number, default: 1 },
      lastUsedAt: { type: Date, default: Date.now }
    }
  ],
  usageLimitPerUser: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// Method to check if voucher is valid
VoucherSchema.methods.isValid = function () {
  const now = new Date();
  return (
    this.isActive &&
    this.expiryDate > now &&
    (this.maxUsage === null || this.usageCount < this.maxUsage)
  );
};
const Voucher = mongoose.model('Voucher', VoucherSchema, 'Voucher');
export default Voucher