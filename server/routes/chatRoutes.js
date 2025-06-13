import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Route to send a message
router.post('/', async (req, res) => {
  const { sender, content, time, userEmail } = req.body.message;

  try {
    const newMessage = new Message({ sender, content, time, userEmail, replies: [] });
    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully', newMessage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Route to get all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Route to reply to a message
router.post('/reply', async (req, res) => {
  const { messageId, reply } = req.body;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.replies.push(reply);
    await message.save();
    res.status(201).json({ message: 'Reply sent successfully', updatedMessage: message });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send reply' });
  }
});

export default router;
