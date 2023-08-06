import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { QUESTION_WITH_ANSWER, SPHERE_STREAMS, SPHERE_SUBMISSION_STATUS, SUBMIT_ANSWER } from "../../apiUrls";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";

const supportedModes = [
  { value: "javascript", label: "Python" },
];

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [mode, setMode] = useState("javascript");
  const [output, setOutput] = useState("");
  const [input, setinput] = useState("");
  const [compilerMessage, setcompilerMessage] = useState("");
  const navigation = useNavigate();
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [cinput, setInput] = useState("");
  const [answers, setAnswers] = useState([]);
  const [answerId, setAnswerId] = useState([]);
  const [submissionId, setSubmissionId] = useState(null);
  const [inputStream, setinputStream] = useState(null);
  const [outputStream, setoutputStream] = useState(null);
  const [errorStream, seterrorStream] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authenticated_token");
    if (!token) {
      navigation("/login");
    }
    fetchData(); 
  }, []);

  useEffect(() => {
    if(submissionId != null){
        fetchSubmissionStatus(submissionId);
    }
  }, [submissionId]);

  useEffect(() => {
    if(inputStream != null){
      fetchInputStream(inputStream);
    }
    if(outputStream != null){
       fetchOutputStream(outputStream);
    }

    if(errorStream != null){
       fetchErrorStream(errorStream);
    }
    
  }, [inputStream,outputStream,errorStream]);
  
  const fetchOutputStream = async (url) => {
    try {
      const response = await axios.post(SPHERE_STREAMS,{stream_uri : url});

      if(response.status === 200){
        console.log(response.data);
        setOutput(response.data);
        setcompilerMessage("Execution successful. Solution accepted.");
      }
    } catch (error) {
      
    }
  }

  const fetchInputStream = async (url) => {
    try {
      const response = await axios.post(SPHERE_STREAMS,{stream_uri : url});

      if(response.status === 200){
        console.log(response.data);
        setinput(response.data);
      }
    } catch (error) {
      
    }
  }

  const fetchErrorStream = async (url) => {
    try {
      const response = await axios.post(SPHERE_STREAMS,{stream_uri : url});

      if(response.status === 200){
        console.log(response.data);
        setcompilerMessage(response.data);
      }
    } catch (error) {
      
    }
  }

  const fetchSubmissionStatus = async (id) => {
      try {
        //fetching submission status with submission ID
        const token = localStorage.getItem("authenticated_token");
      const response = await axios.post(
        SPHERE_SUBMISSION_STATUS+id,{answerId},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      console.log(response.data);
      if(response.status === 200){
        const data = response.data;
        if(!(data.executing)){
           console.log("Execution finished");
            if(data.result.status.code === 15){
              console.log("Status code : " + data.result.status.code);
              //success code accepted
                console.log(data.result.streams.output);
                setoutputStream(data.result.streams.output.uri);
                setinputStream(data.result.streams.input.uri);
            }else{
              //error occured
              console.log("Error occured : " + data.result.status.code === 15);
              if(data.result.streams.cmpinfo != null){
                seterrorStream(data.result.streams.cmpinfo.uri);
              }else{
                seterrorStream(data.result.streams.error.uri);
              }
              setinputStream(data.result.streams.input.uri);
            }
        }else{
          console.log("Still Execution");
          fetchSubmissionStatus(submissionId);
        }
      }
      } catch (error) {
        
      }
  }

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authenticated_token");
      const response = await axios.get(QUESTION_WITH_ANSWER + id, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        if (response.data.status) {
          setQuestion(response.data.data.question);
          setAnswers(response.data.data.answers);
          
          if(response.data.data.answers.length > 0){
            setCode(response.data.data.answers[0].source);
            setInput(response.data.data.answers[0].cinput);
            setSubmissionId(response.data.data.answers[0].submissionId);
            setAnswerId((response.data.data.answers[0]._id));
          }
        }
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };
 
  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  const handleAdd = async (e) => {
    if (code === null || code === "") {
      toast.error("Write code first.", {
        position: "top-right",
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
      const token = localStorage.getItem("authenticated_token");
      const response = await axios.post(
        SUBMIT_ANSWER,
        { questionId: id, source : code , cinput },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      console.log(response);
      if (response.status === 201) {
        toast.success("Answer submitted successfully.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setSubmissionId(response.data.data.submissionId);
        // window.location.reload();
      }
    } catch (error) {
      //setOutput(error);
      console.log(error);
    }
  };

  return (
    <>
    { question != null && <div className="container mx-auto p-4">
    <div className="grid grid-cols-7 gap-4">
      <div className="col-span-2">
        <h1 className="text-2xl font-bold mb-4">Question</h1>
        <p>{question.question}</p>

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
      </div>
      <div className="col-span-5">
        <div className="flex mb-4">
          <label htmlFor="mode-select" className="mr-2">
            Select Mode:
          </label>
          <select
            id="mode-select"
            className="border rounded-md p-1"
            value={mode}
            onChange={handleModeChange}
          >
            {supportedModes.map((modeOption) => (
              <option key={modeOption.value} value={modeOption.value}>
                {modeOption.label}
              </option>
            ))}
          </select>
          <span className="px-4" >{ submissionId && "Submission ID : " + submissionId}</span>
        </div>
        <AceEditor
          mode={mode}
            theme="github"
            name="sourceCode"
            value={code}
            onChange={(value) => setCode(value)}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              useWorker: false,
            }}
          style={{ width: "100%", height: "300px" }}
          className="border rounded-md"
        />
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-1 p-4">
          <button
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleAdd}
        >
          Submit Code
        </button>
          </div>

          <div className="col-span-4 ">
          <label htmlFor="customInput" className="block mb-2 font-bold text-grey">Custom Input:</label>
          <input
            type="text"
            id="customInput"
            name="customInput"
            value={cinput}
            onChange={(value) => setInput(value.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-gray-900"
            placeholder="Enter custom input..."
          />
          </div>
        </div>
        
      </div>
    </div>
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Output</h2>
      <div className="p-4 max-w-3xl mx-auto">
  <div className="flex flex-wrap -mx-4">
    <div className="w-full md:w-1/3 px-4">
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="input">
            Your Input
          </label>
          <input
            id="input"
            className="form-input w-full bg-gray-100 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
            type="text"
            value={input}
            disabled
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="output">
            Your Output
          </label>
          <input
            id="output"
            className="form-input w-full bg-gray-100 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
            type="text"
            value={output}
            disabled
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expected-output">
            Expected Output
          </label>
          <input
            id="expected-output"
            className="form-input w-full bg-gray-100 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
            type="text"
            value={output}
            disabled
          />
        </div>
      </div>
    </div>

    <div className="w-full md:w-2/3 px-4">
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="compiler-message">
          Compiler Message
        </label>
        <textarea
          id="compiler-message"
          className="form-textarea w-full bg-gray-100 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
          rows="4"
          value={compilerMessage}
          disabled
        >
        </textarea>
      </div>
    </div>
  </div>
</div>
    </div>
  </div> }
  </>);
};

export default CodeEditor;
