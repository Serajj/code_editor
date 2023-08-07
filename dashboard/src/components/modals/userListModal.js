// UserListModal.js
import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { SEARCH_USER } from '../../apiUrls';

const UserListItem = ({ user, selected, onClick }) => {
  return (
    <li
      className={`cursor-pointer px-4 py-2 ${
        selected ? 'bg-blue-200' : ''
      } hover:bg-blue-100`}
      onClick={() => onClick(user)}
    >
      {user.name}
      <p className='text-xs'>{user.email}</p>
    </li>
  );
};

const UserListModal = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedOption, setSelectedOption] = useState('single');

 

  const fetchUsers = async (query) => {
    try {
      const response = await axios.get(SEARCH_USER+`?query=${query}`);
      if(response.status === 200){
        setUsers(response.data);
      }else{
        setUsers([]);
      }
     // setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchUsers(e.target.value);
  };

  const handleSelectUser = (user) => {
    console.log(user);
    if(selectedOption === 'single'){
      if(selectedUser.length > 0){
        toast.error("In single mode you can select only one user.", {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }else{
        setSelectedUser((prevUsers) => [...prevUsers,user ]);
      }
    }else{
      setSelectedUser((prevUsers) => [...prevUsers,user ]);
    }
    
    //onClose(user);
  };

  const handleCancel = () => {
    onClose([]);
  }
  const handleSubmit = () => {
    // Do something with the selected user
    if(selectedOption === 'single'){
      if(selectedUser.length === 0){
        toast.error("Please select user to chat.", {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }else{
        if(selectedUser.length > 1){
          toast.error("In single mode you can select only one user.", {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }else{
          onClose(selectedUser);
        }
      }
    }else{
      if(selectedUser.length < 2){
        toast.error("For group select atleast two users.", {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
    }else{
      onClose(selectedUser);
    }
  }
    console.log(selectedUser);
    //onClose(selectedUser);
  };

  const handleRemoveItem = (id) => {
    setSelectedUser((prevItems) => prevItems.filter((item) => item._id !== id));
  };
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-500 bg-opacity-50">
      <div className="bg-white p-4 rounded-lg w-80">
      <div className="w-80">
      <div className="flex flex-wrap space-x-2">
        {selectedUser.map((item) => (
          <div key={item._id} className="flex items-center bg-gray-200 px-3 py-2 rounded-full">
            <span>{item.name}</span>
            <button
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={() => handleRemoveItem(item._id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
        <h2 className="text-xl font-bold mb-4">Select User</h2>
        <div className="flex space-x-4">
      <label className="flex items-center">
        <input
          type="radio"
          value="single"
          checked={selectedOption === 'single'}
          onChange={handleOptionChange}
          className="mr-2"
        />
        Single
      </label>

      <label className="flex items-center">
        <input
          type="radio"
          value="group"
          checked={selectedOption === 'group'}
          onChange={handleOptionChange}
          className="mr-2"
        />
        Group
      </label>
    </div>
        <input
          type="text"
          placeholder="Search users..."
          className="border p-2 rounded mb-4 w-full"
          value={search}
          onChange={handleSearch}
        />
        <div className='max-h-96 overflow-y-scroll'>
        <ul>
          {users && users.map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              onClick={handleSelectUser}
            />
          ))}
        </ul>
        </div>
        <div className="flex justify-between">
          <button
            className="bg-purple-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            Start Chat
          </button>
          <button
            className="bg-yellow-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default UserListModal;
