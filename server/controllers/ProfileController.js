import User from "../models/User.js";

// GET profile information by user email
export const getProfileInformation = async (req, res) => {
  const { email } = req.params;
  if (!email) return res.status(400).json({ error: "User email is required" });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user.profileInformation);
  } catch (error) {
    console.error("Error fetching profile information:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// CREATE profile information (if not already present)
export const createProfileInformation = async (req, res) => {
  const { email, firstName, lastName, gender, mobile, dateOfBirth } = req.body;
  if (!email) return res.status(400).json({ error: "User email is required" });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.profileInformation && Object.keys(user.profileInformation).length > 0) {
      return res.status(400).json({ error: "Profile information already exists. Use update instead." });
    }
    user.profileInformation = { firstName, lastName, gender, mobile, dateOfBirth };
    await user.save();
    res.status(201).json({ message: "Profile information created", profileInformation: user.profileInformation });
  } catch (error) {
    console.error("Error creating profile information:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// UPDATE profile information
export const updateProfileInformation = async (req, res) => {
  const { email, firstName, lastName, gender, mobile, dateOfBirth } = req.body;
  if (!email) return res.status(400).json({ error: "User email is required" });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update only the fields provided; keep others intact.
    user.profileInformation = {
      firstName: firstName !== undefined ? firstName : user.profileInformation?.firstName,
      lastName:  lastName  !== undefined ? lastName  : user.profileInformation?.lastName,
      gender:    gender    !== undefined ? gender    : user.profileInformation?.gender,
      mobile:    mobile    !== undefined ? mobile    : user.profileInformation?.mobile,
      dateOfBirth: dateOfBirth !== undefined ? dateOfBirth : user.profileInformation?.dateOfBirth,
    };
    await user.save();
    res.status(200).json({ message: "Profile information updated", profileInformation: user.profileInformation });
  } catch (error) {
    console.error("Error updating profile information:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE profile information
export const deleteProfileInformation = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "User email is required" });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    user.profileInformation = {}; // or set to null
    await user.save();
    res.status(200).json({ message: "Profile information deleted" });
  } catch (error) {
    console.error("Error deleting profile information:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
