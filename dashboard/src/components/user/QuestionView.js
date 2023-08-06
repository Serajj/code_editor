// src/components/QuestionView.js
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { MainContext } from "../../mainContext";
import "../../assets/css/user.css";
import { QUESTION_WITH_ANSWER, SUBMIT_ANSWER } from "../../apiUrls";
import axios from "axios";
import { toast } from "react-toastify";
const QuestionView = (props) => {
  const { id } = useParams();
  const mainContext = useContext(MainContext);
  const navigation = useNavigate();
  const [question, setQuestion] = useState();
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authenticated_token');
    if(!token){
      navigation('/login');
    }
    const role = localStorage.getItem('authenticated_role');
  }, []);

  const fetchData = async (pageIndex, pageSize) => {
    try {
      const token = localStorage.getItem("authenticated_token");
      const response = await axios.get(QUESTION_WITH_ANSWER + id, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        if (response.data.status) {
          setQuestion(response.data.data.question.question);
          setAnswers(response.data.data.answers);
          console.log(response.data);
        }
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch first page with 10 items per page
  }, []);

  const handleOnchange = (e) =>{ 
    setAnswer(e.target.value);
    console.log(e.target.value);
  }

  const handleAdd =  async(e)=>{
     if(answer === null ){
        toast.error("Enter answer first.", {
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

     try {
        const token = localStorage.getItem('authenticated_token');
        const response = await axios.post(SUBMIT_ANSWER, {questionId : id , submittedAnswer: answer},{
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        });
        console.log(response);
        if(response.status === 201){
            toast.success("Answer submitted successfully.", {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            window.location.reload();
        }
     } catch (error) {
        
     }
  }
  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">{"Questions"}</h1>
        <div className="max-w-md mx-auto">
          <div class="w-full bg-white shadow-lg p-6 text-center">
            <h2 class="text-2xl font-bold">{question}</h2>
          </div>
        </div>

        <div class="max-w-md mx-auto mt-7 bg-white shadow-lg p-6 text-center">
          <h2 class="text-2xl font-bold">Your Answer</h2>
          {answers.length > 0 ? (
            <div class="w-full mt-70 p-6 text-start">
              <ul>
                {answers.map((answer, index) => (
                  <li key={answer._id} className="text-lg font-medium">
                    {answer.submittedAnswer}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div class="flex flex-col">
              <input
                type="text"
                class="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter your text here..."
                onChange={handleOnchange}
              />
              <button class="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300" onClick={handleAdd}>
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QuestionView;
