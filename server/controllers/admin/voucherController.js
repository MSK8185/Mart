import Voucher from "../../models/admin/voucherModels.js";

export const addVoucher = async (req, res) => {
  try {
    const { code, discount, type, expiryDate, isActive, maxUsage, usageLimitPerUser, minPurchase } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ message: 'Voucher code is required' })
    }
    const codeLower = code.trim().toLowerCase()
    const existingVoucher = await Voucher.findOne({ code: codeLower })
    if (existingVoucher) {
      return res.status(400).json({ message: 'Voucher code already exists' })
    }
    const voucher = new Voucher({
      code: codeLower,
      discount: discount,
      type: type,
      expiryDate: expiryDate,
      isActive: isActive,
      maxUsage: maxUsage,
      usageLimitPerUser: usageLimitPerUser,
      minPurchase: minPurchase
    })
    await voucher.save();
    res.status(201).json({
      message: 'Voucher created Successfully',
      voucher
    })
  } catch (error) {
    console.error('error creating Voucher:', error);
    res.status(500).json({ message: 'error creating coucher', error })
  }
}

export const getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find().sort({ createdAt: -1 });
    return res.status(201).json({ vouchers })
  } catch (error) {
    console.error('error fetching vouchers:', error);
    res.status(500).json({ message: "error fetching vouchers", error })
  }
};

export const deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Voucher Id is required' })
    }
    const voucher = await Voucher.findById(id);
    if (!voucher) {
      return res.status(400).json({ message: 'no voucher is found' });
    }
    await Voucher.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Voucher is successfully deleted' });
  } catch (error) {
    console.error({ message: 'Error deleting Voucher', error });
    res.status(500).json({ message: 'Error deleting Voucher', error })
  }
};

export const toggleVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Voucher ID is required' });
    }

    // Find voucher by ID
    const voucher = await Voucher.findById(id);
    if (!voucher) {
      return res.status(404).json({ success: false, message: 'Voucher not found' });
    }

    // Update status
    voucher.isActive = isActive;
    await voucher.save();

    return res.status(200).json({
      success: true,
      message: `Voucher ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: voucher
    });
  } catch (error) {
    console.error('Toggle voucher error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


export const validateVoucher = async (req, res) => {
  try {
    const { code, userEmail, purchaseAmount } = req.body;

    if (!code || !userEmail || !purchaseAmount) {
      return res.status(400).json({
        success: false,
        message: 'code, userEmail, and purchaseAmount are required',
      });
    }

    const voucher = await Voucher.findOne({ code: code.toUpperCase() });

    if (!voucher) {
      return res.status(404).json({
        success: false,
        message: 'Voucher is not valid',
      });
    }

    const now = new Date();

    // Basic checks
    if (!voucher.isActive) {
      return res.status(400).json({ success: false, message: 'Voucher is not active' });
    }

    if (voucher.expiryDate < now) {
      return res.status(400).json({ success: false, message: 'Voucher has expired' });
    }

    if (voucher.maxUsage !== null && voucher.usageCount >= voucher.maxUsage) {
      return res.status(400).json({ success: false, message: 'Voucher usage limit reached' });
    }

    if (purchaseAmount < voucher.minPurchase) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase of ₹${voucher.minPurchase} required to use this voucher`,
      });
    }

    // Check if this email has already used the voucher (but don't increment usage yet)
    const userUsage = voucher.usedBy.find(u => u.email === userEmail);

    if (userUsage) {


      if (currentCount >= voucher.usageLimitPerUser) {
        return res.status(400).json({
          success: false,
          message: 'You have already used this voucher the maximum number of times',
        });
      }
    }

    // Return voucher details without marking as used
    return res.status(200).json({
      success: true,
      message: 'Voucher is valid and can be applied',
      voucher: {
        _id: voucher._id,
        code: voucher.code,
        discount: voucher.discount,
        type: voucher.type,
        maxDiscount: voucher.maxDiscount,
        minPurchase: voucher.minPurchase,
      },
    });
  } catch (error) {
    console.error('Error validating voucher:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const useVoucher = async (req, res) => {
  try {
    const { code, userEmail, orderAmount, orderId } = req.body;

    if (!code || !userEmail || !orderAmount) {
      return res.status(400).json({
        success: false,
        message: 'code, userEmail, and orderAmount are required',
      });
    }

    const voucher = await Voucher.findOne({ code: code.toUpperCase() });

    if (!voucher) {
      return res.status(404).json({
        success: false,
        message: 'Voucher not found',
      });
    }

    const now = new Date();

    // Re-validate voucher before marking as used (safety check)
    if (!voucher.isActive) {
      return res.status(400).json({ success: false, message: 'Voucher is not active' });
    }

    if (voucher.expiryDate < now) {
      return res.status(400).json({ success: false, message: 'Voucher has expired' });
    }

    if (voucher.maxUsage !== null && voucher.usageCount >= voucher.maxUsage) {
      return res.status(400).json({ success: false, message: 'Voucher usage limit reached' });
    }

    // Check if this email has already used the voucher
    const userUsage = voucher.usedBy.find(u => u.email === userEmail);

    if (userUsage) {
      if (userUsage.count >= voucher.usageLimitPerUser) {
        return res.status(400).json({
          success: false,
          message: 'You have already used this voucher the maximum number of times',
        });
      }

      // Increment user usage count
      userUsage.count += 1;
      userUsage.lastUsedAt = now;

      // Add order information if provided
      if (orderId) {
        if (!userUsage.orders) userUsage.orders = [];
        userUsage.orders.push({
          orderId,
          amount: orderAmount,
          usedAt: now
        });
      }
    } else {
      // First time user is using this voucher
      const newUserUsage = {
        email: userEmail,
        count: 1,
        lastUsedAt: now
      };

      // Add order information if provided
      if (orderId) {
        newUserUsage.orders = [{
          orderId,
          amount: orderAmount,
          usedAt: now
        }];
      }

      voucher.usedBy.push(newUserUsage);
    }

    // Update global usage count
    voucher.usageCount += 1;
    await voucher.save();

    return res.status(200).json({
      success: true,
      message: 'Voucher marked as used successfully',
      data: {
        code: voucher.code,
        totalUsageCount: voucher.usageCount,
        userUsageCount: userUsage ? userUsage.count : 1,
      },
    });
  } catch (error) {
    console.error('Error marking voucher as used:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Optional: Get voucher usage statistics
export const getVoucherUsage = async (req, res) => {
  try {
    const { code } = req.params;

    const voucher = await Voucher.findOne({ code: code.toUpperCase() });

    if (!voucher) {
      return res.status(404).json({
        success: false,
        message: 'Voucher not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        code: voucher.code,
        totalUsageCount: voucher.usageCount,
        maxUsage: voucher.maxUsage,
        remainingUsage: voucher.maxUsage ? voucher.maxUsage - voucher.usageCount : 'Unlimited',
        uniqueUsers: voucher.usedBy.length,
        usageDetails: voucher.usedBy.map(user => ({
          email: user.email,
          count: user.count,
          lastUsedAt: user.lastUsedAt,
          orders: user.orders || []
        }))
      },
    });
  } catch (error) {
    console.error('Error getting voucher usage:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
export const editVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedVoucher = await Voucher.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedVoucher) {
      return res.status(404).json({ success: false, message: 'Voucher not found' });
    }

    res.json({ success: true, updatedVoucher });
  } catch (error) {
    console.error('Edit voucher error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
