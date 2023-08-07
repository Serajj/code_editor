// Test.js
import React, { useState } from 'react';

const Test = () => {
    const [isOpen, setsetIsOpen] = useState(false)


  const [users, setUsers] = useState([
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Happy' },
    { id: 3, name: 'new' },
    { id: 3, name: 'asded' },
    { id: 3, name: 'Aldlkmxckdjcnice' },
    { id: 3, name: 'wcmkdc' },
    { id: 3, name: 'Amnjbhlice' },
    { id: 3, name: 'uhyt' },
    { id: 3, name: 'edrs' },
    // Add more users as needed
  ]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState('');

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleSubmit = () => {
    // Do something with the selected user
    console.log(selectedUser);
    setsetIsOpen(false);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-500 bg-opacity-50">
      <div className="bg-white p-4 rounded-lg w-80">
        <h2 className="text-xl font-bold mb-4">Select User</h2>
        <input
          type="text"
          placeholder="Search users..."
          className="border p-2 rounded mb-4 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {filteredUsers.map((user) => (
          <label key={user.id} className="flex items-center space-x-2 mb-2">
            <input
              type="radio"
              checked={selectedUser === user}
              onChange={() => handleSelectUser(user)}
            />
            <span>{user.name}</span>
          </label>
        ))}
        <div className="flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
            disabled={!selectedUser}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  ) : <button onClick={()=>{setsetIsOpen(true)}}>Open</button>;
};

export default Test;
