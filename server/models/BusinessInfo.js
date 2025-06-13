import mongoose from 'mongoose';

const BusinessInfoSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
  },
  panNumber: {
    type: String,
    required: [true, 'PAN number is required'],
    uppercase: true,
    minlength: 10,
    maxlength: 10,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid PAN format'],
  },
  gstin: {
    type: String,
    uppercase: true,
    validate: {
      validator: function (v) {
        return !v || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid GSTIN`,
    },
  },
  businessAddress: {
    type: String,
    required: [true, 'Business address is required'],
    trim: true,
  },
  panFile: {
    type: String,
    required: true,
  },
  aadharFile: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending',
  },
  rejectionRemarks: {
    type: String,
    default: '',
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

BusinessInfoSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const BusinessInfo = mongoose.model('BusinessInfo', BusinessInfoSchema);
export default BusinessInfo;
