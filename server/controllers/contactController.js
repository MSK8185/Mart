import ContactMessage from "../models/contactMessage.js"
import mongoose from "mongoose";

export const submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newMessage = new ContactMessage({ name, email, message });
    await newMessage.save();
    res.status(201).json({ success: true, message: "Message saved successfully." });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ error: "Failed to save message." });
  }

  
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};


export const deleteContact = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error('Invalid ID:', id);
    return res.status(400).json({ message: 'Invalid contact ID' });
  }

  try {
    const deleted = await ContactMessage.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
