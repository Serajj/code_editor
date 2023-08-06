// AdminDashboard.js

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainContext } from '../mainContext';
import DashboardContent from './admin/dashboardContent';
import QuestionContent from './admin/questionsContent';
import UserContent from './admin/usersContent';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const mainContext = useContext(MainContext);
  const navigation = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('authenticated_token');
    if(!token){
      navigation('/login');
    }
   console.log(mainContext.role);
    if(!(mainContext.role === 'admin')){
      navigation('/');
    }
  }, []);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    console.log(activeMenu);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Hamburger Icon for Collapsed Sidebar */}
      

      {/* Sidebar */}
      <aside
        className={`bg-blue-700 text-white w-64 md:w-1/5 flex-shrink-0 ${isSidebarOpen ? 'block' : 'hidden'} md:block transition-all duration-300`}
      >
        {/* Add your sidebar content here */}
        <div className="p-4">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>
        <nav>
          <ul className="py-2">
            <li className="px-4 py-2 hover:bg-blue-800"  onClick={() => handleMenuClick('dashboard')} >Dashboard</li>
            <li className="px-4 py-2 hover:bg-blue-800"  onClick={() => handleMenuClick('users')}>Users</li>
            <li className="px-4 py-2 hover:bg-blue-800"  onClick={() => handleMenuClick('questions')}>Questions</li>
            {/* Add more sidebar items as needed */}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 p-4">
        {/* Header */}
        <header className="bg-white p-4 shadow-md">
          {/* Add your header content here */}
          <h2 className="text-xl font-semibold">Welcome to the Admin Dashboard</h2>
        </header>

        {/* Content */}
        <main className="mt-4 p-4 bg-white shadow-md">
          {/* Add your main content here */}
          {activeMenu === 'dashboard' ? <DashboardContent/> : activeMenu === 'users' ? <UserContent/> : <QuestionContent/>  }
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

//const [currentPage, setCurrentPage] = useState(0);
// {currentPage === 0 ? <DashboardContent/> : currentPage === 1 ? <UserContent/> : <QuestionContent/>  }