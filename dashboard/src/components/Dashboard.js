// src/components/Dashboard.js
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { MainContext } from "../mainContext";
import '../assets/css/user.css';
import Loader from "./loader/Loader";
const Dashboard = (props) => {
  const mainContext = useContext(MainContext);

 
  const userCount = 100;
  const productCount = 250;
  const orderCount = 50;

  const navigation = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('authenticated_token');
    if(!token){
      navigation('/login');
    }
    if(mainContext.role === 'admin'){
      navigation('/admin');
    }
  }, [mainContext]);
  
  
  return (
    <>
    
     <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome {mainContext.loggedInUser && mainContext.loggedInUser.name }</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-semibold">Users</h2>
          <p className="text-4xl font-bold">{userCount}</p>
        </div>
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-semibold">Products</h2>
          <p className="text-4xl font-bold">{productCount}</p>
        </div>
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-semibold">Orders</h2>
          <p className="text-4xl font-bold">{orderCount}</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
