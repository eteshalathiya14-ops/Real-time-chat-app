import React, { useEffect, useRef } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';

const Chat = ({ 
  messages = [], 
  selectedUser, 
  user, 
  newMessage, 
  onMessageChange, 
  onSendMessage,
  sendingMessage = false
}) => {

  const messagesEndRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, 100);
  }, [selectedUser]);

  const avatarSrc =
    selectedUser?.profile_picture || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      selectedUser?.fullname || selectedUser?.username
    )}`;

  const headerContent = selectedUser ? (
    <>
      <img 
        src={avatarSrc}
        alt={selectedUser.fullname}
        className="w-10 h-10 rounded-full border-2 border-white shadow-sm flex-shrink-0"
      />
      <div className="flex flex-col min-w-0">
        <span className="font-bold text-lg text-gray-800 truncate">
          {selectedUser.fullname}
        </span>
        <span className="text-sm text-gray-500">
          @{selectedUser.username}
        </span>
      </div>
    </>
  ) : (
    <span className="font-bold text-lg text-gray-700">
      Select a user to start chatting
    </span>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-transparent">

      {/* Header */}
      <div className="px-4 py-3 border-b bg-white flex items-center gap-3 flex-shrink-0">
        {headerContent}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">

        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            No messages yet
          </div>
        ) : (
          messages.map((m) => (
            <Message 
              key={m._id} 
              message={m} 
              user={user}
              selectedUser={selectedUser}
            />
          ))
        )}

        <div ref={messagesEndRef}></div>

      </div>

      {/* Input */}
      <div className="border-t bg-white flex-shrink-0">
        <ChatInput
          newMessage={newMessage}
          onMessageChange={onMessageChange}
          onSendMessage={onSendMessage}
          disabled={!selectedUser}
          sendingMessage={sendingMessage}
        />
      </div>

    </div>
  );
};

export default Chat;