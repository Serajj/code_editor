// src/components/Login.js
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Header from "./AuthHeader";
import { loginFields } from "./form/formFields";
import Input from "./tools/Input";
import '../assets/css/auth.css';
import { LOGIN } from "../apiUrls";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { MainContext } from "../mainContext";
const Login = () => {

  const mainContext = useContext(MainContext);

  const navigation = useNavigate();
  useEffect(() => {
  
  }, [mainContext,navigation]);

  const fields = loginFields;
  let fieldsState = {};
  
  fields.forEach((field) => (fieldsState[field.id] = ""));

  const [loginState, setLoginState] = useState(fieldsState);

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(loginState);
    try {
      const response = await axios.post(LOGIN, loginState,{
        headers: {
            'Content-Type': 'application/json',
        }
    });
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

        let user = response.data.data.user;
        let token = response.data.data.token;
        localStorage.setItem('authenticated', JSON.stringify(user));
        localStorage.setItem('authenticated_token', token);
        localStorage.setItem('authenticated_role', user.role);
        mainContext.setLoggedInUser(user);
        mainContext.setAuthToken(token);
        mainContext.setrole(user.role);
        console.log("role : "+user.role);
        if(user.role === 'admin'){
          navigation("/admin");
        }
        else{
          if(user.role === 'participant'){
            navigation("/");
          }
      }

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
      <Header
        heading="Login to your account"
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
          <div className="flex items-center justify-between form-extra">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>
          <div className="login-button"> <button
            type="button"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
            onClick={handleSubmit}
          >
            Login
          </button></div>
        </div>
      </form>
      </div>
    </>
  );
};

export default Login;
