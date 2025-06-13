import BusinessInfo from '../models/BusinessInfo.js';
import cloudinary from '../config/cloudinary.js';

export const createBusinessInfo = async (req, res) => {
  try {
    const { email, businessName, panNumber, gstin, businessAddress } = req.body;
 
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
 
    if (!req.files || !req.files.panFile || !req.files.aadharFile) {
      return res.status(400).json({ message: 'Both PAN and Aadhar files are required' });
    }
 
    // Get buffer and mimetype
    const panFile = req.files.panFile[0];
    const aadharFile = req.files.aadharFile[0];
 
    // Convert buffer to base64 string and create data URI
    const panDataUri = `data:${panFile.mimetype};base64,${panFile.buffer.toString('base64')}`;
    const aadharDataUri = `data:${aadharFile.mimetype};base64,${aadharFile.buffer.toString('base64')}`;
 
    // Upload to Cloudinary
    const panUpload = await cloudinary.uploader.upload(panDataUri, {
      folder: 'business_verification/panFiles',
      resource_type: 'auto',
    });
 
    const aadharUpload = await cloudinary.uploader.upload(aadharDataUri, {
      folder: 'business_verification/aadharFiles',
      resource_type: 'auto',
    });
 
    const newBusiness = new BusinessInfo({
      userEmail: email,
      businessName,
      panNumber,
      gstin,
      businessAddress,
      panFile: panUpload.secure_url,
      aadharFile: aadharUpload.secure_url,
    });
 
    await newBusiness.save();
 
    res.status(201).json({ message: 'Business info saved successfully', data: newBusiness });
  } catch (error) {
    console.error('Error saving business info:', error);
    res.status(500).json({ message: 'Error saving business info', error: error.message });
  }
};
 
// Get all businesses 
export const getAllBusinessInfos = async (req, res) => {
  try {
    const businesses = await BusinessInfo.find().sort({ createdAt: -1 });;
    res.status(200).json(businesses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching business data", error: error.message });
  }
};

// Update business status (approve/reject)
export const updateBusinessStatus = async (req, res) => {
  const { id } = req.params;
  const { status, remarks } = req.body;

  if (!["Verified", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const updateFields = {
    status,
    updatedAt: new Date(),
  };

  if (status === 'Rejected') {
    if (!remarks || remarks.trim() === '') {
      return res.status(400).json({ message: "Rejection remarks are required" });
    }
    updateFields.rejectionRemarks = remarks;
  } else {
    updateFields.rejectionRemarks = ''; // Clear old remarks on verification
  }

  try {
    const updated = await BusinessInfo.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.status(200).json({ message: `Business ${status.toLowerCase()} successfully`, updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
};

export const getBusinessInfoByEmail = async (req, res) => {
  try {
    const { userEmail } = req.params;

    if (!userEmail) {
      return res.status(400).json({ message: 'userEmail is required' });
    }

    const businessInfo = await BusinessInfo.find({ userEmail });

    if (!businessInfo) {
      return res.status(404).json({ message: 'Business information not found for this email' });
    }

    res.status(200).json(businessInfo);
  } catch (error) {
    console.error('Error fetching business info by email:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

