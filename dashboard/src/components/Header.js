// Header.js

import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainContext } from '../mainContext';

const Header = (props) => {
  
  const mainContext = useContext(MainContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isAdmin, setisAdmin] = useState(false)
  const navigation = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authenticated_token');
    if(token){
      setisLoggedIn(true);
    }
    if(!(mainContext.role === 'admin' )){
      setisAdmin(true);
    }
  }, []);
  const handleLogout = () => {
    // Simulating a logout action
    localStorage.clear();
    mainContext.setLoggedInUser(null);
    window.location.reload();
  };

  return (
    <header className="bg-purple-800 text-white sticky top-0 z-50">
      <div className="container mx-auto py-4 px-8 md:flex md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold">Welcome {mainContext.loggedInUser != null ? mainContext.loggedInUser.name : ""}</div>
          <button
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <span className="text-white text-2xl">&times;</span> // Close icon (Unicode: times symbol)
            ) : (
              <span className="text-white text-2xl">&#9776;</span> // Hamburger icon (Unicode: three horizontal lines)
            )}
          </button>
        </div>
        <nav className={`md:flex ${isMenuOpen ? 'hidden' : 'hidden'} mt-4 md:mt-0 md:space-x-4`}>
          {/* Add your navigation links here */}
          <a href="/" className="block text-white">Home</a>
           {mainContext.loggedInUser && <Link to="/chat" className="block text-white">Chat</Link>}
            {mainContext.loggedInUser && <Link to="/profile" className="block text-white">Profile</Link>}
          { isAdmin && <Link to="/about" className="block text-white">Questions</Link>}
          
          {mainContext.loggedInUser ? <a href="#" onClick={handleLogout} className="block text-white">Logout</a> : <Link to="/about" className="block text-white">Login</Link>}
          
        </nav>
        {/* Side Drawer */}
        <div className={`fixed top-0 left-0 h-full w-64 bg-purple-800 md:hidden transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform ease-in-out duration-300 z-10`}>
          <nav className="mt-4 space-y-4">
            {/* Add your navigation links here */}
            <a href="/" className="block text-white">Home</a>
            {mainContext.loggedInUser && <Link to="/chat" className="block text-white">Chat</Link>}
            {mainContext.loggedInUser && <Link to="/profile" className="block text-white">Profile</Link>}
            { !isAdmin && <Link to="/questions" className="block text-white">Questions</Link>}
            {mainContext.loggedInUser ? <a href="#" onClick={handleLogout} className="block text-white">Logout</a> : <Link to="/login" className="block text-white">Login</Link>}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
