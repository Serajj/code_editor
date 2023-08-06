import React, { useContext, useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import 'react-quill/dist/quill.snow.css'; // Import Quill CSS
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css'; // Optional: Import Quill bubble theme CSS
import axios from 'axios';
import { ADD_QUESTION, SINGLE_QUESTION } from '../../apiUrls';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { MainContext } from '../../mainContext';

const QuestionForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);
  const navigation = useNavigate();
  const mainContext = useContext(MainContext);
  const { id } = useParams();

  useEffect(() => {
    if(!(mainContext.role === 'admin')){
      navigation('/');
    }
     if(id != null || id === ''){
      setIsUpdate(true);
      fetchQuestionData(id);
     }
   
    
  }, [id,mainContext]);

  const fetchQuestionData = async (id) => {
    try {
      // Your API endpoint for fetching the question data by its id
      const token = localStorage.getItem('authenticated_token');
      const response = await axios.get(SINGLE_QUESTION+id,{ headers: {
        'Content-Type': 'application/json',
        Authorization: token
    }});

      if(response.status === 200){
        const questionData = response.data.data;
        setTitle(questionData.question);
        setDescription(questionData.description);
        setSourceCode(questionData.source);
      }
    } catch (error) {
      console.error('Failed to fetch question data:', error);
      alert('Failed to fetch question data. Please try again later.');
    }
  };
  

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // Your API endpoint for adding a question
   

    if(title === null || title === ''){
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
    if(description === null || description === ''){
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

    if(sourceCode === null || sourceCode === ''){
      toast.error("Please write source code", {
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
    const response = await axios.put(ADD_QUESTION+'/'+id, {question: title , description : description,source:sourceCode},{
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
    }
  } catch (error) {
    
  }
}

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Your API endpoint for adding a question
   

    if(title === null || title === ''){
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
    if(description === null || description === ''){
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

    if(sourceCode === null || sourceCode === ''){
      toast.error("Please write source code", {
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
        const response = await axios.post(ADD_QUESTION, {question:title , description:description , source:sourceCode},{
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        });
        console.log(response);
        if(response.status === 201){
            toast.success("Question added successfully.", {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
               // Reset the form after successful submission
              setTitle('');
              setDescription('');
              setSourceCode('');
              navigation('/');
        }
    } catch (error) {
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Question</h1>
      <form onSubmit={ isUpdate ? handleUpdateSubmit : handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block font-bold mb-2">
            Title:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-md p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block font-bold mb-2">
            Description:
          </label>
          <ReactQuill
            value={description}
            onChange={setDescription}
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, 4, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['clean'],
              ],
            }}
            formats={[
              'header',
              'bold',
              'italic',
              'underline',
              'strike',
              'blockquote',
              'list',
              'bullet',
              'link',
              'image',
            ]}
            className="quill-editor"
            style={{ height: '300px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <div className="mb-4 mt-4">
          <label htmlFor="sourceCode" className="block font-bold mb-2">
            Source Code:
          </label>
          <AceEditor
            mode="javascript"
            theme="github"
            name="sourceCode"
            value={sourceCode}
            onChange={(value) => setSourceCode(value)}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              useWorker: false,
            }}
            style={{ width: '100%', height: '300px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          {isUpdate ? "Update" : "Add Question"}
        </button>
      </form>
    </div>
  );
};

export default QuestionForm;
