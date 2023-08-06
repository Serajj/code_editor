import React from 'react'
import { useState } from 'react';
import { BrowserRouter, Routes , Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MainContext } from './mainContext';
import Header from './components/Header';
import AdminDashboard from './components/AdminDashboard';
import QuestionsView from './components/user/QuestionsView';
import QuestionView from './components/user/QuestionView';
import CodeEditor from './components/editor/CodeEditor';
import QuestionForm from './components/admin/QuestionForm';
import SingleQuestionDetail from './components/admin/SingleQuestionDetail';
import Loader from './components/loader/Loader';

function App() {
    //we can use redux also for authentication but here I am using custom method
   
  return (
    
    <MainContext.Consumer>
    {({ loggedInUser }) => (
      <>
        <BrowserRouter>
        <Loader/>
           <Header user={loggedInUser}/>
           
            <Routes>
                <Route path="/" element={<Dashboard  />} />
                <Route path="/register" element={<Register   />} />
                <Route path="/login" element={<Login  />} />
                <Route path="/admin" element={<AdminDashboard  />} />
                <Route path="/questions" element={<QuestionsView  />} />
                <Route path="/question/:id" element={<CodeEditor/>} />
                <Route path="/add_question" element = {<QuestionForm/>} />
                <Route path="/view_question/:id" element={<SingleQuestionDetail  />} />
                <Route path="/edit_question/:id" element = {<QuestionForm/>} />
                <Route path="/admin/view_question/:id" element={<SingleQuestionDetail  />} />
                <Route path="/admin/edit_question/:id" element = {<QuestionForm/>} />
                <Route path="/code" element={<CodeEditor  />} />
            </Routes>
        </BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
    </>
    )}
    </MainContext.Consumer>
    
  )
}

export default App;
