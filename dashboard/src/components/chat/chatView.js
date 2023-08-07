// src/components/ChatView.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { START_CHAT, START_CHAT_BY_ROOM } from '../../apiUrls';
import UserListModal from '../modals/userListModal';
import Sidebar from './chatSidebar';
import ChatWindow from './chatWindow';

const ChatView = () => {
    
    const [isUserListModalOpen, setUserListModalOpen] = useState(false);
const [currectUserForChat, setcurrectUserForChat] = useState();
const [selectedUser, setselectedUser] = useState(null);

const [chatData, setchatData] = useState(null);
    const handleOpenModal = () => {
        setUserListModalOpen(true);
      };
      const navigation = useNavigate();

      useEffect(() => {
        const token = localStorage.getItem('authenticated_token');
        if(!token){
          navigation('/login');
        }
      }, []);
      
    
      const startChat = async(users)=>{
            const token = localStorage.getItem('authenticated_token');
            const user_ids = users.map((item)=>{
                  return item._id;
            });
            console.log(user_ids);
            const response = await axios.post(START_CHAT,{receiverIds : user_ids},{headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }});
            console.log(response.data);
            if(response.status === 200){
                setchatData(response.data.chatData);
                setcurrectUserForChat(users[0]);
            }else{
               
            }
      }

      const startChatWithRoom = async(roomId)=>{
        const token = localStorage.getItem('authenticated_token');
        try {
          const response = await axios.post(START_CHAT_BY_ROOM,{roomId : roomId},{headers: {
            'Content-Type': 'application/json',
            Authorization: token
        }});
        console.log(response.data);
        if(response.status === 200){
            setchatData(response.data.chatData);
            setcurrectUserForChat(roomId);
        }else{
           
        }
        } catch (error) {
          
        }
  }
      const handleCloseModal = (user) => {
        console.log(user);
          setselectedUser(user);
          if(user.length > 0){
            console.log(user.length);
            startChat(user);
         }
        
       
        setUserListModalOpen(false);
      };

    

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 overflow-hidden">
      <Sidebar startChat={startChatWithRoom} />
      <ChatWindow currectUserForChat={currectUserForChat} chat={chatData} />
      <div className="floating-btn" onClick={handleOpenModal}>+</div>
      {isUserListModalOpen && <UserListModal isOpen={isUserListModalOpen} onClose={handleCloseModal}/>}
    </div>
  );
};

export default ChatView;
