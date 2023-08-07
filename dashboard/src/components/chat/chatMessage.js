// src/components/ChatMessage.js
import React from 'react';

const ChatMessage = ({ sender, message, timestamp }) => {
  return (
    <div className="flex flex-col my-2">
      <div className="text-xs text-gray-500">{sender}</div>
      <div className="bg-gray-200 rounded-lg p-2">
        <p>{message}</p>
        <div className="text-right text-xs text-gray-500">{timestamp}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
