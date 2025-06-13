import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    content: { type: String, required: true },
    time: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    messages: [messageSchema]
});

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
