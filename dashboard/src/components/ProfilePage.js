import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UPDATE_PROFILE } from '../apiUrls';
import { MainContext } from '../mainContext';
import ImageUpload from './tools/ImageUpload';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [profilePicture, setProfilePicture] = useState(null);

  const navigation = useNavigate();
const mainContext=useContext(MainContext);

  useEffect(() => {
    const token = localStorage.getItem('authenticated_token');
    if(!token){
      navigation('/login');
    }
  }, []);

  useEffect(() => {
    if(mainContext.loggedInUser){
        console.log(mainContext.loggedInUser);
   setName(mainContext.loggedInUser.name);
   setEmail(mainContext.loggedInUser.email);
   if(mainContext.loggedInUser.avatar){
    setProfilePicture(mainContext.loggedInUser.avatar);
   }
}
  }, [mainContext]);
  

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick = async() => {
    try {
        const token = localStorage.getItem('authenticated_token');
        const response = await axios.post(UPDATE_PROFILE,{name , avatar:profilePicture,email},{headers: {
            'Content-Type': 'application/json',
            Authorization: token
        }});
        console.log(response.data);
        if(response.status === 200){
            mainContext.setLoggedInUser(response.data.updatedUser);
            localStorage.setItem('authenticated', JSON.stringify(response.data.updatedUser));

            toast.success("Updated successfully", {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
        }else{
            toast.error("Failed to update.", {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
        }
    } catch (error) {
        
    }
    setIsEditing(false);
    // You can perform the update logic here, like making an API call to update the user data.
  };



  const handleProfilePicCallback = (profileImageUrl) => {
    setProfilePicture(profileImageUrl);
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg">
        <div className="p-4">
          <div className="text-center">
            <img
              className="w-24 h-24 object-cover mx-auto rounded-full"
              src={profilePicture === null ? "https://via.placeholder.com/150" : profilePicture}
              alt="Profile"
            />
            <h1 className="text-2xl font-semibold mt-2">{name}</h1>
            <p className="text-gray-600">{email}</p>
          </div>
          <div className="mt-4">
            {isEditing ? (
              <>
                <div className="mb-2">
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {}}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    disabled
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="profilePicture">
                    Profile Picture
                  </label>
                  <ImageUpload callback={handleProfilePicCallback}/>
                </div>
                <button
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleUpdateClick}
                >
                  Update
                </button>
              </>
            ) : (
              <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleEditClick}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
