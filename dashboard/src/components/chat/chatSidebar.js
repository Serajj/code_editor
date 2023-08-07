import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { CHAT_LIST } from '../../apiUrls';
import { MainContext } from '../../mainContext';

const Sidebar = ({startChat}) => {

  const [sidebarItems, setsidebarItems] = useState([]);
 
  const [selectedRoom, setselectedRoom] = useState();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const mainContext = useContext(MainContext);

  

  useEffect(() => {
    
    fetchChats();
    
  }, [])
  
  const fetchChats = async()=>{
   try {
    const token = localStorage.getItem('authenticated_token');
    console.log(token);
    const response = await axios.post(CHAT_LIST,{data:"no data"},{headers: {
        'Content-Type': 'application/json',
        Authorization: token
    }});

    console.log(response.data);
    if(response.status === 200){
      setsidebarItems(response.data.chats);
    }
   } catch (error) {
    console.log(error);
   }
  }

  const checkScreenSize = () => {
    setIsSmallScreen(window.innerWidth < 768);
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const handleSidebarItemClick = (roomId)=>{
    //console.log(roomId);
    setselectedRoom(roomId);
    startChat(roomId);
  }

  return (
    <div className="w-full md:w-64 md:h-screen md:sticky md:top-0 md:bg-gray-800 text-white md:flex md:flex-col h-screen overflow-y-hidden">
      <div className="hidden md:block md:h-16 bg-gray-800 flex items-center justify-center">
        <h1 className="text-white text-xl font-bold">Discussion Area</h1>
      </div>
      {!isSmallScreen && (
        <div className="md:h-100px md:overflow-y-auto">
          {sidebarItems.map((item) => (
            <div key={item._id} className={selectedRoom === item.roomId ? "flex items-center p-4 border-b border-gray-700 bg-purple-800 cursor-pointer" : "flex items-center p-4 border-b border-gray-700 hover:bg-red-600 cursor-pointer"} onClick={()=>{handleSidebarItemClick(item.roomId)}}>
              <img src={item.isGroup ? "https://via.placeholder.com/150" : item.participants[0]._id === mainContext.loggedInUser._id ? item.participants[1].avatar ?? "https://via.placeholder.com/150" : item.participants[0].avatar ?? "https://via.placeholder.com/150"} alt={ item.isGroup ? item.title : item.name} className="w-12 h-12 rounded-full mr-4" />
              <p className="text-sm text-gray-300">{item.isGroup ? item.title : item.participants[0]._id === mainContext.loggedInUser._id ? item.participants[1].name : item.participants[0].name }</p>
            </div>
          ))}
        </div>
      )}
      <div className="md:hidden overflow-x-auto flex items-center pb-4">
        {sidebarItems.map((item) => (
          <div key={item._id} className="flex flex-col items-center p-2 cursor-pointer" onClick={()=>{handleSidebarItemClick(item.roomId)}}>
            <img src={item.isGroup ? "https://via.placeholder.com/150" : item.participants[0]._id === mainContext.loggedInUser._id ? item.participants[1].avatar ?? "https://via.placeholder.com/150" : item.participants[0].avatar ?? "https://via.placeholder.com/150"} alt={item.name} className="w-12 h-12 rounded-full mb-2" />
            <p className="text-sm text-gray-300">{item.isGroup ? item.title : item.participants[0]._id === mainContext.loggedInUser._id ? item.participants[1].name : item.participants[0].name }</p>
          </div>
        ))}
      </div>
      <div className="md:hidden p-4">
      </div>
    </div>
  );
};

export default Sidebar;
