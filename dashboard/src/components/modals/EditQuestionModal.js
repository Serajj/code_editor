import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { ADD_QUESTION } from '../../apiUrls';

const EditQuestionModal = ({ question, onSave, onCancel }) => {
  const [editedQuestion, setEditedQuestion] = useState(question.question);
  const [editedDescription, setEditedDescription] = useState(question.description);

  const handleSave = async() => {
    console.log(question);
    if(editedQuestion === null || editedQuestion === ''){
        toast.error("Please enter question", {
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
    if(editedDescription === null || editedDescription === ''){
        toast.error("Please enter description", {
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
        const response = await axios.put(ADD_QUESTION+'/'+question._id, {question: editedQuestion , description : editedDescription},{
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        });
        console.log(response);
        if(response.status === 200){
            toast.success("Question updated successfully.", {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              onSave();
        }
    } catch (error) {
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-6 rounded shadow-md z-10">
        <div className="mb-4">
          <label htmlFor="question" className="block font-semibold mb-2">
            Question
          </label>
          <input
            type="text"
            id="question"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            value={editedQuestion}
            onChange={(e) => setEditedQuestion(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block font-semibold mb-2">
            Description
          </label>
          <textarea
            id="description"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            rows="4"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
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

export default EditQuestionModal;
