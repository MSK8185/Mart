// import React, { useState, useEffect, useRef } from 'react';
// // import axios from 'axios';


// const ChatSupport = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const userId = 'SH8888'; // Replace with actual user ID
//   const chatEndRef = useRef(null); // Reference to track the end of the chat for scrolling

//     // Fetch all messages for the user on component mount and poll every 3 seconds
//     useEffect(() => {
//       const fetchMessages = async () => {
//         try {
//           const response = await axios.get(`http://localhost:8081/api/chat/${userId}`);
//           setMessages(response.data.messages);
//         } catch (error) {
//           console.error('Error fetching messages:', error);
//         }
//       };

//        // Initial fetch
//     fetchMessages();

//     // Poll every 3 seconds
//     const interval = setInterval(fetchMessages, 3000);

//     // Cleanup interval on component unmount
//     return () => clearInterval(interval);
//   }, [userId]);

//    // Scroll to the bottom of the chat when messages change
//    useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (newMessage.trim()) {
//       const now = new Date();
//       const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//       // Optimistically add user message to local state
//       const userMessage = { sender: 'user', content: newMessage, time };
//       setMessages((prevMessages) => [...prevMessages, userMessage]);

//       setNewMessage(''); // Clear input field

//       // Save user message to the database
//       try {
//         await axios.post(`http://localhost:8081/api/chat/${userId}/message`, {
//           sender: 'user',
//           content: newMessage,
//         });
//       } catch (error) {
//         console.error('Error saving user message:', error);
//       }
//     }
//   };


//   const handleClearChat = async () => {
//     try {
//       await axios.delete(`http://localhost:8081/api/chat/${userId}/clear`); // Endpoint to clear chat messages
//       setMessages([]); // Clear local messages
//     } catch (error) {
//       console.error('Error clearing messages:', error);
//     }
//   };


//   const toggleChat = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="fixed bottom-4 right-4">
//       <header className="chat-header">
//         <h2>Conversation With Administrator</h2>
//         <button onClick={handleClearChat} className="clear-button">Clear Chat</button>
//       </header>
//       <div className="chat-messages">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'admin-message'}`}
//           >
//             <div className="message-text">{msg.content}</div>

//             <div className="message-time">
//               {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//             </div>
//           </div>
//         ))}
//         <div ref={chatEndRef} /> {/* This div helps scroll to the latest message */}
//       </div>

//       <div className="chat-input">
//         <input
//           type="text"
//           placeholder="Type a message..."
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//         />
//         <button onClick={handleSendMessage}>Send</button>
//       </div>

//       <button
//         className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
//         onClick={toggleChat}
//       >
//         💬
//       </button>
//       {isOpen && (
//         <div className="fixed bottom-20 right-4 w-72 h-96 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col">
//           <button
//             className="text-gray-500 text-xl p-2 self-end hover:text-gray-700"
//             onClick={toggleChat}
//           >
//             ✖
//           </button>
//           <div className="p-4 overflow-y-auto flex-1">
//             <p>Welcome to Chat Support!</p>
//             {/* Add more chat content here */}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatSupport;
























// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

// const ChatSupport = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const userId = 'SH8888'; // Replace with actual user ID
//   const chatEndRef = useRef(null);

//   // Fetch all messages for the user on component mount and poll every 3 seconds
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/chat/${userId}`);
//         setMessages(response.data.messages);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();
//     const interval = setInterval(fetchMessages, 3000);

//     return () => clearInterval(interval);
//   }, [userId]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (newMessage.trim()) {
//       const now = new Date();
//       const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//       const userMessage = { sender: 'user', content: newMessage, time };
//       setMessages((prevMessages) => [...prevMessages, userMessage]);

//       setNewMessage('');

//       try {
//         await axios.post(`http://localhost:5000/api/chat/${userId}/message`, {
//           sender: 'user',
//           content: newMessage,
//         });
//       } catch (error) {
//         console.error('Error saving user message:', error);
//       }
//     }
//   };

//   const handleClearChat = async () => {
//     try {
//       await axios.delete(`http://localhost:5000/api/chat/${userId}/clear`);
//       setMessages([]);
//     } catch (error) {
//       console.error('Error clearing messages:', error);
//     }
//   };

//   const toggleChat = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="fixed bottom-4 right-4">
//       <button
//         className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full p-3 shadow-lg hover:scale-105 transform transition-all duration-200"
//         onClick={toggleChat}
//       >
//         💬
//       </button>

//       {isOpen && (
//         <div className="fixed bottom-20 right-4 w-80 h-96 bg-white border border-gray-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
//           <header className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-xl">
//             <h2 className="text-lg font-semibold">Chat Support</h2>
//             <button
//               className="text-white hover:text-gray-200"
//               onClick={handleClearChat}
//               title="Clear Chat"
//             >
//               🗑️
//             </button>
//           </header>

//           <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`p-3 rounded-lg max-w-xs ${
//                   msg.sender === 'user'
//                     ? 'bg-blue-100 self-end'
//                     : 'bg-indigo-100 self-start'
//                 }`}
//               >
//                 <p className="text-sm">{msg.content}</p>
//                 <span className="block text-xs text-gray-500 mt-1">
//                   {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </span>
//               </div>
//             ))}
//             <div ref={chatEndRef} />
//           </div>

//           <div className="flex items-center p-2 bg-white border-t border-gray-200">
//             <input
//               type="text"
//               className="flex-1 px-4 py-2 border rounded-full focus:ring focus:ring-indigo-200 focus:outline-none"
//               placeholder="Type a message..."
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
//             />
//             <button
//               onClick={handleSendMessage}
//               className="ml-2 bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-all duration-200"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatSupport;


















// import React, { useState, useEffect, useRef } from 'react';


// const ChatSupport = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const userId = 'SH8888'; // Replace with actual user ID
//   const chatEndRef = useRef(null);





//   const handleSendMessage = async () => {
//     if (newMessage.trim()) {
//       const now = new Date();
//       const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//       const userMessage = { sender: 'user', content: newMessage, time };
//       setMessages((prevMessages) => [...prevMessages, userMessage]);

//       setNewMessage('');


 
//     }
//   };

//   const handleClearChat = async () => {
 
//   };

//   const toggleChat = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="fixed bottom-4 right-4">
//       <button
//         className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full p-3 shadow-lg hover:scale-105 transform transition-all duration-200"
//         onClick={toggleChat}
//       >
//         💬
//       </button>

//       {isOpen && (
//         <div className="fixed bottom-20 right-4 w-80 h-96 bg-white border border-gray-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
//           <header className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-xl">
//             <h2 className="text-lg font-semibold">Chat Support</h2>
//             <button
//               className="text-white hover:text-gray-200"
//               onClick={handleClearChat}
//               title="Clear Chat"
//             >
//               🗑️
//             </button>
//           </header>

//           <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`p-3 rounded-lg max-w-xs ${
//                   msg.sender === 'user'
//                     ? 'bg-blue-100 self-end'
//                     : 'bg-indigo-100 self-start'
//                 }`}
//               >
//                 <p className="text-sm">{msg.content}</p>
//                 <span className="block text-xs text-gray-500 mt-1">
//                   {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </span>
//               </div>
//             ))}
//             <div ref={chatEndRef} />
//           </div>

//           <div className="flex items-center p-2 bg-white border-t border-gray-200">
//             <input
//               type="text"
//               className="flex-1 px-4 py-2 border rounded-full focus:ring focus:ring-indigo-200 focus:outline-none"
//               placeholder="Type a message..."
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
//             />
//             <button
//               onClick={handleSendMessage}
//               className="ml-2 bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-all duration-200"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatSupport;








//3
// import React, { useState, useRef } from 'react';
// import { useSelector } from 'react-redux';

// const ChatSupport = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const chatEndRef = useRef(null);

//   // Access userId from Redux store
//   const userId = useSelector((state) => state.user.userId);

//   const handleSendMessage = async () => {
//     if (newMessage.trim()) {
//       const now = new Date();
//       const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//       const userMessage = { sender: 'user', content: newMessage, time, userId };
//       setMessages((prevMessages) => [...prevMessages, userMessage]);

//       setNewMessage('');
//     }
//   };

//   // Define handleClearChat function to clear the chat messages
//   const handleClearChat = () => {
//     setMessages([]);
//   };

//   const toggleChat = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="fixed bottom-4 right-4">
//       <button
//         className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full p-3 shadow-lg hover:scale-105 transform transition-all duration-200"
//         onClick={toggleChat}
//       >
//         💬
//       </button>

//       {isOpen && (
//         <div className="fixed bottom-20 right-4 w-80 h-96 bg-white border border-gray-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
//           <header className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-xl">
//             <h2 className="text-lg font-semibold">Chat Support</h2>
//             <button
//               className="text-white hover:text-gray-200"
//               onClick={handleClearChat}
//               title="Clear Chat"
//             >
//               🗑️
//             </button>
//           </header>

//           <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`p-3 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-blue-100 self-end' : 'bg-indigo-100 self-start'}`}
//               >
//                 <p className="text-sm">{msg.content}</p>
//                 <span className="block text-xs text-gray-500 mt-1">{msg.time}</span>
//               </div>
//             ))}
//             <div ref={chatEndRef} />
//           </div>

//           <div className="flex items-center p-2 bg-white border-t border-gray-200">
//             <input
//               type="text"
//               className="flex-1 px-4 py-2 border rounded-full focus:ring focus:ring-indigo-200 focus:outline-none"
//               placeholder="Type a message..."
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
//             />
//             <button
//               onClick={handleSendMessage}
//               className="ml-2 bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-all duration-200"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatSupport;





//4
// import React, { useState, useRef } from 'react';
// import { useSelector } from 'react-redux';

// const ChatSupport = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const chatEndRef = useRef(null);

//   // Access email from Redux store
//   const userEmail = useSelector((state) => state.user.email);

//   const handleSendMessage = async () => {
//     if (newMessage.trim()) {
//       const now = new Date();
//       const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//       const userMessage = { sender: 'user', content: newMessage, time, userEmail };
//       setMessages((prevMessages) => [...prevMessages, userMessage]);

//       setNewMessage('');
//     }
//   };

//   const handleClearChat = () => {
//     setMessages([]);
//   };

//   const toggleChat = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="fixed bottom-4 right-4">
//       <button
//         className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full p-3 shadow-lg hover:scale-105 transform transition-all duration-200"
//         onClick={toggleChat}
//       >
//         💬
//       </button>

//       {isOpen && (
//         <div className="fixed bottom-20 right-4 w-80 h-96 bg-white border border-gray-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
//           <header className="flex flex-col items-center p-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-xl">
//             <h2 className="text-lg font-semibold">Chat Support</h2>
//             {userEmail && (
//               <p className="text-red-500 mt-1 text-sm font-medium">
//                 {userEmail}
//               </p>
//             )}
//             <button
//               className="text-white hover:text-gray-200 mt-2"
//               onClick={handleClearChat}
//               title="Clear Chat"
//             >
//               🗑️
//             </button>
//           </header>

//           <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`p-3 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-blue-100 self-end' : 'bg-indigo-100 self-start'}`}
//               >
//                 <p className="text-sm">{msg.content}</p>
//                 <span className="block text-xs text-gray-500 mt-1">{msg.time}</span>
//               </div>
//             ))}
//             <div ref={chatEndRef} />
//           </div>

//           <div className="flex items-center p-2 bg-white border-t border-gray-200">
//             <input
//               type="text"
//               className="flex-1 px-4 py-2 border rounded-full focus:ring focus:ring-indigo-200 focus:outline-none"
//               placeholder="Type a message..."
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
//             />
//             <button
//               onClick={handleSendMessage}
//               className="ml-2 bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-all duration-200"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatSupport;












































import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  // Access user email from Redux store
  const userEmail = useSelector((state) => state.user.email);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const userMessage = { sender: 'user', content: newMessage, time, userEmail };

      // Send message to the server
      try {
        await axios.post('/api/messages', { message: userMessage });
        setMessages((prevMessages) => [...prevMessages, userMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
      }

      setNewMessage('');
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4">
      <button
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full p-3 shadow-lg hover:scale-105 transform transition-all duration-200"
        onClick={toggleChat}
      >
        💬
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-white border border-gray-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
          <header className="flex flex-col items-center p-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-xl">
            <h2 className="text-lg font-semibold">Chat Support</h2>
            {userEmail && <p className="text-red-500 mt-1 text-sm font-medium">{userEmail}</p>}
          </header>

          <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`p-3 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-blue-100 self-end' : 'bg-indigo-100 self-start'}`}>
                <p className="text-sm">{msg.content}</p>
                <span className="block text-xs text-gray-500 mt-1">{msg.time}</span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="flex items-center p-2 bg-white border-t border-gray-200">
            <input
              type="text"
              className="flex-1 px-4 py-2 border rounded-full focus:ring focus:ring-indigo-200 focus:outline-none"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-all duration-200"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSupport;
