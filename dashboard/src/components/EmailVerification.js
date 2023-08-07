// src/components/Login.js
import React, {  useEffect, useState } from "react";
import axios from "axios";
import Header from "./AuthHeader";
import {  resendLinkFields } from "./form/formFields";
import Input from "./tools/Input";
import '../assets/css/auth.css';
import {SEND_VERIFICATION } from "../apiUrls";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
const EmailVerification = () => {


  const navigation = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('authenticated_token');
    if(token){
      navigation('/');
    }
  }, []);

  const fields = resendLinkFields; 
  let fieldsState = {};
  
  fields.forEach((field) => (fieldsState[field.id] = ""));

  const [resendState, setresendState] = useState(fieldsState);

  const handleChange = (e) => {
    setresendState({ ...resendState, [e.target.id]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(resendState);
    try {
      const response = await axios.post(SEND_VERIFICATION, resendState,{
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if(response.status === 200){
        if(response.data.status){
            toast.success(response.data.message, {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
    
            navigation('/login');
          }else{
            console.log("Unauthorized");
            if(response.data.code === 400){
              if(response.data.data.email){
                toast.error(response.data.data.email, {
                  position: 'top-right',
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              }         
          }else{
            toast.error(response.data.message, {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
    
          }
    }
      
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong , try again in sometime", {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    


   
  };

  const handleSendVerification = async()=>{
    console.log("Sending verification mail..");
  }

  return (
    <>
      <Header
        heading="Send verification link"
        paragraph="Don't have an account yet? "
        linkName="Signup"
        linkUrl="/register"
      />
     <div className="login-form-wrapper flex justify-center">
      <form className="mt-8 space-y-6">
        <div className="-space-y-px">
       
          {fields.map((field) => (
            <Input
              key={field.id}
              handleChange={handleChange}
              value={resendState[field.id]}
              labelText={field.labelText}
              labelFor={field.labelFor}
              id={field.id}
              name={field.name}
              type={field.type}
              isRequired={field.isRequired}
              placeholder={field.placeholder}
            />
          ))}
          
          <div className="login-button"> <button
            type="button"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
            onClick={handleSubmit}
          >
            Resend Verification Link
          </button></div>
        </div>
      </form>
      </div>
    </>
  );
};

export default EmailVerification;
