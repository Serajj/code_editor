import React, { useState, useRef, useEffect, useContext } from "react";
import { FaPaperclip, FaArrowAltCircleRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { MainContext } from "../../mainContext";
import socket from "../tools/socket";

const ChatWindow = ({currectUserForChat , chat}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomId, setroomId] = useState(null);
  const mainContext = useContext(MainContext);
  
  useEffect(() => {
    if(chat != null){
    setMessages(chat.messages);
    setroomId(chat.roomId);
    
        socket.emit('joinRoom', { roomId:chat.roomId });
    }
  }, [chat])
  

  useEffect(() => {
    socket.on('connect', () => {
        console.log('Connected to server');
    });
    // Event: New message received
    socket.on('newMessage', (data) => {
      // Display the new message
      console.log("data from server");
      console.log(data);
      if(data.status){
        if(data.newMessage.user !== mainContext.loggedInUser._id)
        setMessages((prevMessages) => [...prevMessages,data.newMessage ]);  
      }
      
    });

    // Clean up event listener when component unmounts
    return () => {
      socket.off('newMessage');
    };
  }, []);

  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if(currectUserForChat != null){
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return; // Prevent sending empty messages
    const user = mainContext.loggedInUser._id;
   const timestamp =new Date().toISOString()
    const data = {
      roomId,
      user:mainContext.loggedInUser._id,
      message: inputMessage,
      timestamp
    };
    socket.emit('sendMessage', { data });
    setMessages([...messages, {message:inputMessage,user,timestamp}]);
    setInputMessage("");
  };

  return (
    <div className="w-full md:w-3/4 mx-auto mt-4 flex flex-col h-screen" style={{height:600}}>
     { currectUserForChat !=null ? <><div
        className="flex-grow bg-gray-100 p-4 rounded-lg overflow-y-auto scrollbar-hide"
        ref={chatContainerRef}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.user === mainContext.loggedInUser._id
                ? "flex justify-end"
                : "flex justify-start"
            }`}
          >
            <div
              className={`rounded-lg p-2 ${
                message.user === mainContext.loggedInUser._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              <p className="text-sm">{message.message}</p>
              <p className="text-xs text-gray-500">{message.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 w-3/4 p-4 bg-white border-t flex items-center">
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          className="flex-grow border rounded-l-lg p-2"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 items-center text-white p-3  hover:bg-blue-600"
        >
          <FaArrowAltCircleRight size={18} />
        </button>
        <button className="bg-green-500 text-white p-3 ml-2 hover:bg-green-600">
          <FaPaperclip size={18} />
        </button>
      </div> </> : <div>No user selected</div>}
    </div>
  );
};

export default ChatWindow;
