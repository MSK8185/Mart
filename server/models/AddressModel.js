import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    userEmail: { 
        type: String,
        required: true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        validate: {
            validator: function (v) {
                return /^[\+]?[1-9][\d]{0,15}$/.test(v);
            },
            message: 'Please enter a valid phone number'
        }
    },
    street: {
        type: String,
        required: [true, 'Street address is required'],
        trim: true,
        maxlength: [200, 'Street address cannot exceed 200 characters']
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        maxlength: [100, 'City name cannot exceed 100 characters']
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
        maxlength: [100, 'State name cannot exceed 100 characters']
    },
    postalCode: {
        type: String,
        required: [true, 'Postal code is required'],
        trim: true,
        validate: {
            validator: function (v) {
                return /^[0-9]{5,10}$/.test(v);
            },
            message: 'Please enter a valid postal code'
        }
    },
    isDefault: {
        type: Boolean,
    }
}, {
    timestamps: true
});

// Ensure only one default address per user
addressSchema.pre('save', async function (next) {
    if (this.isDefault) {
        await this.constructor.updateMany(
            { userId: this.userId, _id: { $ne: this._id } },
            { isDefault: false }
        );
    }
    next();
});

// Add indexes for better performance
addressSchema.index({ userId: 1 });
addressSchema.index({ createdAt: -1 });

const Address = mongoose.model('Address', addressSchema, 'Address');
export default Address;