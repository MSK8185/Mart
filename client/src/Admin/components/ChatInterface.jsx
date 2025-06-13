import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]); 
  const [replies, setReplies] = useState({}); 

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('/api/messages');
        if (Array.isArray(response.data)) {
          setMessages(response.data);
        } else {
          console.error('API response is not an array:', response.data);
          setMessages([]); 
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]); 
      }
    };

    fetchMessages();
  }, []);

  const handleSendReply = async (messageId, userEmail) => {
    const replyContent = replies[messageId];

    if (replyContent.trim()) {
      const adminReply = {
        sender: 'admin',
        content: replyContent,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        userEmail,
      };

      try {
        await axios.post('/api/messages/reply', { reply: adminReply, messageId });

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, replies: [...(msg.replies || []), adminReply] }
              : msg
          )
        );
        setReplies((prevReplies) => ({ ...prevReplies, [messageId]: '' }));
      } catch (error) {
        console.error('Error sending reply:', error);
      }
    }
  };

  const handleReplyChange = (messageId, value) => {
    setReplies((prevReplies) => ({ ...prevReplies, [messageId]: value }));
  };

  return (
    <div className="admin-panel">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      {Array.isArray(messages) && messages.length > 0 ? (
        messages.map((msg) => (
          <div key={msg.id} className="p-4 border-b">
            <p className="font-bold text-blue-600">From: {msg.userEmail}</p>
            <p>{msg.content}</p>

            {/* Display existing replies */}
            {msg.replies && msg.replies.length > 0 && (
              <div className="mt-2">
                {msg.replies.map((reply, index) => (
                  <div key={index} className="border-t pt-2 mt-2">
                    <p className="font-semibold text-gray-700">Reply:</p>
                    <p>{reply.content}</p>
                    <span className="text-sm text-gray-500">{reply.time}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Input for sending reply */}
            <div className="mt-2">
              <input
                type="text"
                className="border p-2 w-full"
                placeholder="Type your reply..."
                value={replies[msg.id] || ''}
                onChange={(e) => handleReplyChange(msg.id, e.target.value)}
              />
              <button
                onClick={() => handleSendReply(msg.id, msg.userEmail)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Send Reply
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No messages available.</p>
      )}
    </div>
  );
};

export default ChatInterface;
