// src/components/AdminDashboard.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_QUESTIONS } from '../../apiUrls';
import AdminQuestionTable from '../tools/AdminQuestionTable';
import QuestionTable from '../tools/QuestionTable';

const QuestionContent = () => {
  const navigation = useNavigate();
  const [questions, setQuestions] = useState([]);
  const itemsPerPage = 5;
 
 

 
  return (
    <>
      <AdminQuestionTable itemsPerPage={itemsPerPage}  />
     </>
  );
};

export default QuestionContent;
