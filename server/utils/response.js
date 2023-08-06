
const sendResponse = (status , message , data , responseCode = 200) => {
  return {"status":status , "message" : message , "data" : data , "code" : responseCode};
  };
  
  module.exports = sendResponse;
  

