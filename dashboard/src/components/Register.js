// src/components/Register.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthHeader from './AuthHeader';
import { signupFields } from './form/formFields';
import { toast } from 'react-toastify';
import Input from './tools/Input';
import { REGISTER } from '../apiUrls';
import '../assets/css/auth.css';
import { useNavigate } from 'react-router-dom';
import { MainContext } from '../mainContext';
const Register = () => {
  const mainContext = useContext(MainContext);

  const navigation = useNavigate();
  const fields = signupFields;
  let fieldsState = {};
  fields.forEach((field) => (fieldsState[field.id] = ""));

  const [loginState, setLoginState] = useState(fieldsState);

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    const token = localStorage.getItem('authenticated_token');
    if(token){
      navigation('/');
    }
  }, []);

 
  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!(loginState.password === loginState.confirm_password)){
      toast.error("Password not matched.", {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    console.log(loginState);
    try {
      const response = await axios.post(REGISTER, loginState,{
        headers: {
            'Content-Type': 'application/json',
        }
    });
    console.log(response.data);
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

        // let user = response.data.data.user;
        // let token = response.data.data.token;
        // localStorage.setItem('authenticated', JSON.stringify(user));
        // localStorage.setItem('authenticated_token', token);
        // localStorage.setItem('authenticated_role', user.role);

      
        // mainContext.setLoggedInUser(user);
        // mainContext.setAuthToken(token);
        navigation("/login");

      }else{
        console.log("Unauthorized");
        if(response.data.code === 400){
          
          if(response.data.data.name){
            toast.error(response.data.data.name, {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }

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

          if(response.data.data.password){
            toast.error(response.data.data.password, {
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
    } catch (error) {
      console.log(error);
    }
    


   
  };

  return (
    <>
      <AuthHeader
        heading="Create new account"
        paragraph="Already have an account? "
        linkName="Login"
        linkUrl="/login"
      />
     <div className="login-form-wrapper flex justify-center">
      <form className="mt-8 space-y-6">
        <div className="-space-y-px">
          {fields.map((field) => (
            <Input
              key={field.id}
              handleChange={handleChange}
              value={loginState[field.id]}
              labelText={field.labelText}
              labelFor={field.labelFor}
              id={field.id}
              name={field.name}
              type={field.type}
              isRequired={field.isRequired}
              placeholder={field.placeholder}
            />
          ))}
          
          <div className="register-button"> <button
            type="button"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
            onClick={handleSubmit}
          >
            Register
          </button></div>
        </div>
      </form>
      </div>
    </>
  );
};

export default Register;
