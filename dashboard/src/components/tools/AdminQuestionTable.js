import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import EditQuestionModal from '../modals/EditQuestionModal';
import AddQuestionModal from '../modals/AddQuestionModal';
import axios from 'axios';
import { ADD_QUESTION, ALL_QUESTIONS } from '../../apiUrls';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminQuestionTable = ({ itemsPerPage }) => {
  const navigation = useNavigate();

    useEffect(() => {
   

        fetchQuestions();
      }, []);
 const [data, setData] = useState([]);

 
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);

  const [idToDelete, setTdToDelete] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const offset = currentPage * itemsPerPage;
  const currentPageData = data.length > 0 ? data.slice(offset, offset + itemsPerPage) : 0;
  const pageCount = Math.ceil(data.length / itemsPerPage);

  
  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem('authenticated_token');
      const response = await axios.get(ALL_QUESTIONS,{headers:{
        Authorization: token
      }}); // Replace with your API 
      if(response.status === 200){
          if(response.data.status){
            setData(response.data.data);
          }
      }else{
          
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };


  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleView = (id)=> {
    navigation('view_question/'+id);
  }

  const handleEdit = (question)=> {
    //setSelectedQuestion(question);
    //setShowEditModal(true);
    navigation('edit_question/'+question._id);
  }

  const handleDelete = (id)=> {
    setTdToDelete(id);
    setShowModal(true);
  }

  

  const handleDeleteCallback = async() => {
    
    try {
        const token = localStorage.getItem('authenticated_token');
        const response = await axios.delete(ADD_QUESTION+'/'+idToDelete,{headers:{
          Authorization: token
        }}); // Replace with your API 
        if(response.status === 200){
            toast.success("Question deleted successfully.", {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
        }else{
            
        }
        fetchQuestions();
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    

    setShowModal(false);
  };

  const handleCancel = () => {
    setTdToDelete(null);
    setShowModal(false);
  };
  const handleEditQuestionSave = () => {
    fetchQuestions();
    setShowEditModal(false);
  }

  const handleEditQuestionCancel = () => {
    setShowEditModal(false);
  }

  const handleAddQuestionSave = () => {
    fetchQuestions();
    setShowAddQuestionModal(false);
  }

  const handleAddQuestionCancel = () => {
    setShowAddQuestionModal(false);
  }
  const showAdQuestionodal = ()=>{
    navigation('/add_question');
    //setShowAddQuestionModal(true);
  }
  return (
    <div>
        <div className="flex items-center justify-between px-4 py-2 bg-gray-200">
      
      <div>
        <p>All Questions</p>
       
      </div>
      
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={showAdQuestionodal}>
        Add Question
      </button>
    </div>
      { data.length > 0 ? <div>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Question</th>
            <th className="border px-4 py-2">Test Cases</th>
            <th className="border px-4 py-2">Action</th>
           
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((item,index) => (
            <tr key={item._id}>
              <td className="border px-4 py-2">{index + 1 + offset}</td>
              <td className="border px-4 py-2">{item.question}</td>
              <td className="border px-4 py-2">{item.testCases.length} </td>
              <td className="border px-4 py-2 space-x-2">

              <button className="text-blue-500" onClick={() => handleView(item._id)}>
              <FaEye />
                </button>
                <button className="text-yellow-500" onClick={() => handleEdit(item)}>
                <FaEdit />
                </button>
                <button className="text-red-500" onClick={() => handleDelete(item._id)}>
                <FaTrash />
                </button>
                
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />
      </div>
      </div> : <div className="flex flex-col items-center justify-center h-screen">
      <svg
        className="w-16 h-16 text-gray-300 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 14.5L12 21l-7-6.5M12 3v12"
        />
      </svg>
      <p className="text-gray-500">No data available</p>
    </div>}
      {showModal && (
        <DeleteConfirmationModal onDelete={handleDeleteCallback} onCancel={handleCancel} />
      )}

{showEditModal && (
        <EditQuestionModal
          question={selectedQuestion}
          onSave={handleEditQuestionSave}
          onCancel={handleEditQuestionCancel}
        />
      )}

{showAddQuestionModal && <AddQuestionModal onSave={handleAddQuestionSave} onCancel={handleAddQuestionCancel} />}
    </div>
  );
};

export default AdminQuestionTable;
