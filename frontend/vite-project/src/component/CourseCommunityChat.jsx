import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { MdSend } from 'react-icons/md';

const CourseCommunityChat = ({ courseId, courseName, userId, token }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const tags = [
    { name: 'task', color: 'bg-orange-500', textColor: 'text-orange-100' },
    { name: 'theory', color: 'bg-blue-500', textColor: 'text-blue-100' },
    { name: 'bug', color: 'bg-red-500', textColor: 'text-red-100' },
    { name: 'project', color: 'bg-green-500', textColor: 'text-green-100' },
    { name: 'question', color: 'bg-purple-500', textColor: 'text-purple-100' },
  ];

  const getTagStyle = (tagName) => {
    const tag = tags.find(t => t.name === tagName);
    return tag || { color: 'bg-gray-500', textColor: 'text-gray-100' };
  };

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!courseId) {
      setError('Missing course ID');
      setIsLoading(false);
      return;
    }

    // Connect to Socket.IO server with credentials
    const socket = io('http://localhost:3000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      withCredentials: true,
    });

    socketRef.current = socket;

    // Authentication
    socket.on('connect', () => {
      console.log('Socket connected, authenticating...');
      socket.emit('authenticate', { token: token || 'cookie-based' });
    });

    socket.on('authenticated', () => {
      console.log('Socket authenticated');
      socket.emit('join_room', { courseId });
      setIsConnected(true);
    });

    // Room join confirmation
    socket.on('room_joined', (data) => {
      console.log('✓ join_room: Successfully joined room:', data.courseId);
      setIsLoading(false);
      setError('');
    });

    // Load message history
    socket.on('message_history', (data) => {
      setMessages(data.messages || []);
    });

    // Receive new messages
    socket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // User joined notification
    socket.on('user_joined', (data) => {
      const notification = {
        id: Date.now().toString(),
        userName: data.userName,
        message: data.message,
        timestamp: new Date(),
        isNotification: true,
        type: 'joined',
      };
      setMessages((prev) => [...prev, notification]);
    });

    // Error handling
    socket.on('error', (data) => {
      console.error('Socket error:', data);
      setError(data.message || 'Connection error');
      setIsLoading(false);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [courseId, token]);

  // Handle message send
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !socketRef.current) return;

    const messageData = {
      message: inputValue,
      courseId,
      tag: selectedTag || null,
    };

    socketRef.current.emit('send_message', messageData);
    setInputValue('');
    setSelectedTag('');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading chat...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !isConnected) {
    return (
      <div className="h-screen w-full bg-gray-900 flex items-center justify-center">
        <div className="bg-red-900 border border-red-700 rounded-lg p-6 max-w-md">
          <h3 className="text-red-100 font-bold mb-2">Connection Error</h3>
          <p className="text-red-100 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="flex flex-col items-center px-4 py-6 md:px-8">
          {messages.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-400 text-lg mb-2">No messages yet</p>
              <p className="text-gray-500 text-sm">Be the first to start the discussion!</p>
            </div>
          ) : (
            <div className="w-full max-w-2xl space-y-5">
              {messages.map((msg) => {
                if (msg.isNotification) {
                  return (
                    <div key={msg.id} className="flex justify-center py-2">
                      <p className="text-gray-400 text-xs italic">{msg.message}</p>
                    </div>
                  );
                }

                const isInstructor = msg.isInstructor || msg.role === 'Instructor';
                const tagStyle = msg.tag ? getTagStyle(msg.tag) : null;

                return (
                  <div key={msg.id} className="w-full">
                    <div className="rounded-xl px-6 py-5 transition-all duration-200">
                      {/* Sender info */}
                      <div className="flex items-baseline gap-3 mb-3 pl-1">
                        <span className={`font-semibold ${
                          isInstructor ? 'text-green-600' : 'text-gray-900'
                        }`}>
                          {msg.userName}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {isInstructor ? 'Instructor' : 'Student'}
                        </span>
                        {msg.tag && tagStyle && (
                          <span className="text-xs text-gray-600 font-medium">
                            #{msg.tag}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 ml-auto">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {/* Message text */}
                      <p className="text-gray-800 text-sm leading-relaxed break-words pl-1">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <footer className="bg-white border-t border-gray-200 px-4 py-6 md:px-8 shadow-sm flex justify-center">
        <form onSubmit={handleSendMessage} className="w-full max-w-2xl">
          {/* Tag selector buttons */}
          <div className="flex gap-3 flex-wrap pb-3 mb-3">
              {tags.map((tag) => (
                <button
                  key={tag.name}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedTag(selectedTag === tag.name ? '' : tag.name);
                  }}
                  className={`text-sm px-4 py-[0.7rem] rounded-full font-medium whitespace-nowrap ${
                    selectedTag === tag.name
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  #{tag.name}
                </button>
              ))}
            </div>

          {/* Input field - ChatGPT/Copilot style */}
          <div className="bg-white border border-gray-200 rounded-lg pl-5 pr-8 py-3 shadow-sm hover:border-gray-300 hover:shadow-md focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:shadow-lg transition-all flex items-center gap-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Ask a question or share an idea…"
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 text-center focus:outline-none text-base leading-relaxed resize-none max-h-32 min-h-10 overflow-y-auto py-2 mt-1"
              rows="1"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || !isConnected}
              className="flex-shrink-0 text-gray-500 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors p-2 hover:bg-blue-50 rounded-lg"
              title="Send message (Enter)"
            >
              <MdSend className="w-6 h-6 -ml-3" />
            </button>
          </div>

          {!isConnected && (
            <p className="text-sm text-yellow-500 mt-3 text-center">Connecting...</p>
          )}
        </form>
      </footer>
    </div>
  );
};

export default CourseCommunityChat;
