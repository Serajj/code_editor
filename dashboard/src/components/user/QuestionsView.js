import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { MainContext } from "../../mainContext";
import '../../assets/css/user.css';
import QuestionTable from "../tools/QuestionTable";
import { GET_QUESTIONS, PARTICIPANTS_LIST } from "../../apiUrls";
const QuestionsView = (props) => {
  const mainContext = useContext(MainContext);

  const navigation = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('authenticated_token');
    if(!token){
      navigation('/login');
    }
    const role = localStorage.getItem('authenticated_role');
  }, []);

 

  
  const columns = [
    {
      Header: 'Question',
      accessor: 'question',
    },
  
    {
      Header: 'Actions',
      accessor: 'actions', 
      Cell: ({ row }) => (
        <div className="flex w-full justify-end">
          <button
            onClick={() => handleView(row.original._id)} 
            className="px-2 py-1 m-auto bg-blue-500 text-white rounded"
          >
            View
          </button>
         
        </div>
      ),
    },
  ];

  const url = GET_QUESTIONS;

  const handleView = (id) => {
    // Handle the view action here
    console.log(`Viewing data for ID: ${id}`);
    navigation('/question/'+id);
  };

  const handleDelete = (id) => {
    // Handle the delete action here
    mainContext.setCurrenId(id);
    console.log(`Deleting data for ID: ${id}`);
  };
  return (
    <>
     <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{"Questions"}</h1>
      <QuestionTable columns={columns} url={url} />
    </div>
    </>
  );
};

export default QuestionsView;
