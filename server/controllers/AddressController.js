import Address from "../models/AddressModel.js";

export const addAddress = async (req, res) => {
    try {
        const { email, name, phone, street, city, state, postalCode, isDefault } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' })
        }
        const address = new Address({
            userEmail: email,
            name: name,
            phone: phone,
            street: street,
            city: city,
            state: state,
            postalCode: postalCode,
            isDefault: isDefault
        });
        await address.save();
        res.status(201).json({ message: 'Address saved successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Error saving Address', error });
        console.log('Error saving Address', error);

    }
};

export const fetchAddress = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' })
        };
        const address = await Address.find({ userEmail: email });
        return res.status(200).json({ address });
    } catch (error) {
        console.error('error fetching Address:', error);
        res.status(500).json({ message: "error fetching Address", error })
    }
}

export const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Address ID is required' });
        }

        const updatedAddress = await Address.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
        });

        if (!updatedAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.status(200).json({ message: 'Address updated successfully', address: updatedAddress });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ message: 'Failed to update address', error });
    }
};

export const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Address Id is required' })
        };
        const address = await Address.findById(id);
        if (!address) {
            return RTCRtpSender.status(400).json({ message: 'No Addresss is found' })
        };
        await Address.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Address is successfully deleted' });
    } catch (error) {
        console.error({ message: 'Error deleting Address', error });
        res.status(500).json({ message: 'Error Address Voucher', error })
    }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: 'Address ID is required' });
    }

    // Get the address to retrieve the userEmail
    const selectedAddress = await Address.findById(_id);

    if (!selectedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

    const userEmail = selectedAddress.userEmail;

    // Set isDefault: false for all addresses of this user
    await Address.updateMany(
      { userEmail },
      { $set: { isDefault: false } }
    );

    // Set isDefault: true for the selected address
    await Address.findByIdAndUpdate(_id, { isDefault: true });

    res.status(200).json({ message: 'Default address set successfully' });
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({ message: 'Failed to set default address', error });
  }
};

