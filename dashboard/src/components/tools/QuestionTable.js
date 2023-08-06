import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useTable, usePagination } from 'react-table';
import { MainContext } from '../../mainContext';

const QuestionTable = ({ columns  , url }) => {
  const mainContext = useContext(MainContext);

  const [data, setData] = useState([]);
  const [totalCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [canNextPage, setCanNextPage] = useState(true);
  const [canPreviousPage, setCanPreviousPage] = useState(false);

  const pageSize = 5; // Number of items per page
  const fetchData = async (pageIndex, pageSize) => {
    try {
      const token = localStorage.getItem('authenticated_token');
      const response = await axios.get(url, {
        params: {
          page: pageIndex + 1,
          pageSize,
        },
        headers:{
          Authorization: token
        }
      });
      if(response.status === 200){
        if(response.data.status){
          setData(response.data.data.questions);
          setPageCount(response.data.data.totalquestions);
          if(response.data.data.totalquestions < pageSize){
            setCanNextPage(false);
          }
        }
    }else{
        
    }
      
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData(pageIndex, pageSize); // Fetch first page with 10 items per page
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      manualPagination: true, // Set manualPagination to true
      pageCount: Math.ceil(data.length / pageSize),
    },
    usePagination
  );

  const goToPage = (page) => {
    setPageIndex(page);
  };

  const previousPage = () => {
    if(pageIndex === 1){
       setCanPreviousPage(false);
       setCanNextPage(true);
    }
    if (canPreviousPage) {
      setPageIndex((prevIndex) => prevIndex - 1);
      fetchData(pageIndex - 1,pageSize);
    }
  };
  
 
  const canNextPageCheck= (pageIndex , totalCount) => {
    console.log(parseInt(pageIndex) < parseInt(totalCount/pageSize));
    console.log(parseInt(pageIndex)  + ' ' +parseInt(totalCount/pageSize));
     return parseInt(pageIndex) < parseInt(totalCount/pageSize);
  }

  const nextPage = () => {
    setCanPreviousPage(true);
    if (canNextPage) {
      setCanNextPage(canNextPageCheck(pageIndex+1,totalCount));
      setPageIndex((prevIndex) => prevIndex + 1);
      fetchData(pageIndex + 1,pageSize);
    }
  };

  return (<div className="container mx-auto">
  <table {...getTableProps()} className="w-full bg-white shadow-md rounded">
    <thead>
      {headerGroups.map((headerGroup) => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => (
            <th
              {...column.getHeaderProps()}
              className="px-4 py-2 border-b border-gray-200"
            >
              {column.render('Header')}
            </th>
          ))}
        </tr>
      ))}
    </thead>
    <tbody {...getTableBodyProps()}>
      {page.map((row) => {
        prepareRow(row);
        return (
          <tr {...row.getRowProps()}>
            {row.cells.map((cell) => {
              return (
                <td
                  {...cell.getCellProps()}
                  className="px-4 py-2 border-b border-gray-200"
                >
                  {cell.render('Cell')}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  </table>
  <div className="flex justify-between mt-4">
    <button
      onClick={previousPage}
      disabled={!canPreviousPage}
      className={`px-4 py-2 ${
        canPreviousPage ? 'text-blue-500' : 'text-gray-500'
      }`}
    >
      Previous
    </button>
    <div>
      Page{' '}
      <strong>
        {pageIndex+1} of {Math.ceil(totalCount/pageSize)}
      </strong>
    </div>
    <button
      onClick={nextPage}
      disabled={!canNextPage}
      className={`px-4 py-2 ${
        canNextPage ? 'text-blue-500' : 'text-gray-500'
      }`}
    >
      Next
    </button>
  </div>
</div>
);
};

export default QuestionTable;
