import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { ADD_QUESTION } from '../../apiUrls';

const AddQuestionModal = ({ id, onSave, onCancel }) => {
  const [input, setInput] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');

  const handleSave = async() => {
    console.log(input);
    if(input === null || input === ''){
        toast.error("Please enter input", {
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
    if(expectedOutput === null || expectedOutput === ''){
        toast.error("Please enter output", {
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
        const response = await axios.post(ADD_QUESTION +'/'+ id + '/testcases', {input , expectedOutput},{
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        });
        console.log(response);
        if(response.status === 200){
            toast.success("Test case added successfully.", {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              onSave();
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
    } catch (error) {
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-6 rounded shadow-md z-10 min-w-[400px]">
        <h2 className="text-2xl font-semibold mb-4">Add Test Case</h2>
        <div className="mb-4">
          <label htmlFor="question" className="block font-semibold mb-2">
            Input
          </label>
          <input
            type="text"
            id="question"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block font-semibold mb-2">
            Expected output
          </label>
          <textarea
            id="description"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            rows="4"
            value={expectedOutput}
            onChange={(e) => setExpectedOutput(e.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionModal;
