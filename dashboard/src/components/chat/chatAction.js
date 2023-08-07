import React, { useState } from 'react';
import { FaArrowAltCircleRight, FaPaperclip } from 'react-icons/fa';

const ChatAction = ({ onSendMessage }) => {
  const [inputMessage, setInputMessage] = useState('');

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;
    onSendMessage(inputMessage);
    setInputMessage('');
  };

  return (
    <div className="fixed bottom-0 bg-white border-t flex items-center">
      <input
        type="text"
        value={inputMessage}
        onChange={handleInputChange}
        className="flex-grow border rounded-l-lg p-2"
        placeholder="Type your message..."
      />
      <button
        onClick={handleSendMessage}
        className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600"
      >
        <FaArrowAltCircleRight size={18} />
      </button>
      <button className="bg-green-500 text-white px-4 ml-2 rounded-r-lg hover:bg-green-600">
        <FaPaperclip size={18} />
      </button>
    </div>
  );
};

export default ChatAction;
