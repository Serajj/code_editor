import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { DELETE_TESTCASE, SINGLE_QUESTION } from "../../apiUrls";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AddQuestionModal from "../modals/AddQuestionModal";
import {  FaTrash } from 'react-icons/fa';
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import { toast } from "react-toastify";

const SingleQuestionDetail = () => {
  const [question, setQuestion] = useState(null);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const navigation = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [idToDelete, setTdToDelete] = useState(null);


  const { id } = useParams();
  useEffect(() => {
    if (id != null || id === "") {
      fetchQuestionDetail(id);
    }
  }, [id]);

  const fetchQuestionDetail = async (id) => {

    try {
      // Your API endpoint for fetching the question data by its id
      const token = localStorage.getItem("authenticated_token");
      const response = await axios.get(SINGLE_QUESTION + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.status === 200) {
        const questionData = response.data.data;
        setQuestion(questionData);
      }
    } catch (error) {
      console.error("Failed to fetch question data:", error);
      alert("Failed to fetch question data. Please try again later.");
    }
  };

  const handleAddQuestionSave = () => {
    fetchQuestionDetail(id);
    setShowAddQuestionModal(false);
  }

  const handleAddQuestionCancel = () => {
    setShowAddQuestionModal(false);
  }
  const showAdQuestionodal = ()=>{
    setShowAddQuestionModal(true);
  }

  const handleDeleteCallback = async() => {
    
    try {
        const token = localStorage.getItem('authenticated_token');
        const response = await axios.post(DELETE_TESTCASE,{questionId:id,testCaseId:idToDelete},{headers:{
          Authorization: token
        }}); // Replace with your API 
        if(response.status === 200){
            toast.success("Test case deleted successfully.", {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              window.location.reload();
        }else{
            toast.error("Failed to delete.", {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
        }
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    

    setShowModal(false);
  };
  const handleCancel = () => {
    setShowModal(false);
  };
 const handleDeleteTestCase = (id)=>{
    setTdToDelete(id);
    setShowModal(true);
 }
  return (
    <div className="container mx-auto p-4">
      {question ? (
        <>
        <div className="mb-4">
            <h1 className="text-2xl font-bold mb-4">{question.question}</h1>
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block font-bold mb-2">
              Description:
            </label>
            <ReactQuill
              value={question.description}
              readOnly={true}
              modules={{
                toolbar: false, // Disable the toolbar in read-only mode
              }}
              formats={[]} // Disable formats in read-only mode
              className="quill-editor"
              style={{ border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="sourceCode" className="block font-bold mb-2">
              Source Code:
            </label>
            <pre className="bg-gray-100 p-4 mt-4 rounded-md">
              <code>{question.source}</code>
            </pre>
          </div>

          <div className="mb-4">
            <label htmlFor="sourceCode" className="block font-bold mb-2">
              Test Cases :
            </label>
            <div className="border rounded-md p-2">
              {question.testCases.map((testCase, index) => (
                <div
                  key={index}
                  className="border-b p-2 flex justify-between items-center"
                >
                  <div>
                    <p>
                      <strong>Input:</strong> {testCase.input}
                    </p>
                    <p>
                      <strong>Expected Output:</strong> {testCase.expectedOutput}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteTestCase(testCase._id)}
                    className="text-red-500"
                  >
                   <FaTrash/>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button className="bg-yellow-500 w-full hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mt-4 block text-center" onClick={showAdQuestionodal}>
        Add Test Case
      </button>
          <Link
            to={`/edit_question/${question._id}`}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4 block text-center"
          >
            Edit
          </Link>
          
        </>
      ) : (
        <p>Loading question...</p>
      )}
{showModal && (
        <DeleteConfirmationModal onDelete={handleDeleteCallback} onCancel={handleCancel} />
      )}
{showAddQuestionModal && <AddQuestionModal id={id} onSave={handleAddQuestionSave} onCancel={handleAddQuestionCancel} />}
    </div>
  );
};

export default SingleQuestionDetail;
