// src/components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import UsersTable from '../tools/UsersTable';
import '../../assets/css/table.css';
import axios from 'axios';
import { PARTICIPANTS_LIST } from '../../apiUrls';
import { toast } from 'react-toastify';

const UserContent = () => {
    const [participants, setParticipants] = useState([]);
  
    
      const itemsPerPage = 5;

      useEffect(() => {
        const fetchParticipants = async () => {
          try {
            const response = await axios.get(PARTICIPANTS_LIST); // Replace with your API 
            if(response.status === 200){
                if(response.data.status){
                    setParticipants(response.data.data);
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
    <UsersTable data={participants} itemsPerPage={itemsPerPage} />
     </>
  );
};

export default UserContent;
