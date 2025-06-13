import React, { useState } from 'react';

const Chat = () => {

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      status: 'Online',
      messages: [
        { sender: 'Alice', text: 'Hey, how are you?', timestamp: '10:15 AM' },
        { sender: 'You', text: 'I’m doing well! How about you?', timestamp: '10:17 AM' },
      ],
    },
    {
      id: 2,
      name: 'Bob Smith',
      status: 'Offline',
      messages: [
        { sender: 'Bob', text: 'Are you free this weekend?', timestamp: '9:00 AM' },
        { sender: 'You', text: 'Yes, let’s catch up!', timestamp: '9:05 AM' },
      ],
    },
  ]);

  const [selectedUserId, setSelectedUserId] = useState(users[0].id);
  const [newMessage, setNewMessage] = useState('');

  const selectedUser = users.find(user => user.id === selectedUserId);

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const updatedUsers = users.map(user => {
      if (user.id === selectedUserId) {
        return {
          ...user,
          messages: [
            ...user.messages,
            { sender: 'You', text: newMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
          ],
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    setNewMessage('');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-indigo-100 font-poppins">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-lg p-4 overflow-y-auto rounded-r-lg">
        <h2 className="text-2xl font-semibold text-purple-800 mb-6">Messages</h2>
        <div className="space-y-4">
          {users.map(user => (
            <div
              key={user.id}
              className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors duration-200 ${
                user.id === selectedUserId ? 'bg-purple-200' : 'hover:bg-indigo-100'
              }`}
              onClick={() => handleUserSelect(user.id)}
            >
              <div className={`h-10 w-10 ${user.status === 'Online' ? 'bg-gradient-to-br from-purple-400 to-indigo-400' : 'bg-gray-300'} rounded-full flex items-center justify-center text-white font-bold`}>
                {user.name[0]}
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.status}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 p-6 bg-white rounded-l-lg shadow-lg flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
          <h3 className="text-xl font-semibold text-gray-700">{selectedUser.name}</h3>
          <p className="text-sm text-gray-500">{selectedUser.status === 'Online' ? 'Active now' : 'Last seen recently'}</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {selectedUser.messages.map((message, index) => (
            <div key={index} className={`flex items-start ${message.sender === 'You' ? 'justify-end' : ''}`}>
              {message.sender !== 'You' && (
                <div className="h-8 w-8 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold">
                  {message.sender[0]}
                </div>
              )}
              <div className="ml-4">
                <div className={`${message.sender === 'You' ? 'bg-indigo-100' : 'bg-purple-100'} p-4 rounded-2xl shadow-sm`}>
                  <p className="text-gray-700">{message.text}</p>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-right">{message.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="mt-6 flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-400 transition duration-200"
          />
          <button
            onClick={handleSendMessage}
            className="ml-4 px-4 py-3 bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition duration-200 shadow-md"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
};

export default Chat;
