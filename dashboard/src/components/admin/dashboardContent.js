// src/components/AdminDashboard.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ADMIN_DASHBOARD } from '../../apiUrls';
const Tile = ({ bgColor, count, label }) => {
    return (
      <div className={`bg-${bgColor}-500 p-4 text-white rounded-lg shadow-md flex flex-col items-center justify-center`}>
        <h2 className="text-lg font-semibold text-gray-300">{label}</h2>
        <p className="text-4xl font-bold text-black">{count}</p>
      </div>
    );
  };

const DashboardContent = () => {
  const [totalQuestion, setQuestionCount] = useState(0);
  const [totalUser, setUserCount] = useState(0);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(ADMIN_DASHBOARD); // Replace with your API 
        if(response.status === 200){
            if(response.data.status){
              setQuestionCount(response.data.data.questionsCount);
              setUserCount(response.data.data.usersCount);
            }
        }else{
            
        }
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    fetchParticipants();
  }, []);
  
  return (
    <>
     <div className="grid grid-cols-2 md:grid-cols-2 gap-4 justify-center">
      <Tile bgColor="blue" count={totalUser} label="Total Participants" />
      <Tile bgColor="green" count={totalQuestion} label="Total Question" />
    </div>
     </>
  );
};

export default DashboardContent;
