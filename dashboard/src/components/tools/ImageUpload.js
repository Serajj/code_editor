import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseConfig';
import '../../assets/css/imageupload.css';
import loaderImg from '../../assets/images/loading.gif';
import { toast } from 'react-toastify';
// Initialize Firebase with your Firebase config object


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const ImageUpload = ({callback}) => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
const [isUploading, setisUploading] = useState(false);
  const handleChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setSelectedFile(file);

  };

  const handleUpload = () => {
    if (image) {
        setisUploading(true);
      const storageRef = ref(storage, image.name);

      uploadBytes(storageRef, image).then(() => {
        getDownloadURL(storageRef).then((url) => {
          setImageUrl(url);
          setisUploading(false);
          callback(url);
        });
      });
    }else{
        toast.error("Browse image first.", {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
    }
  };

  return (
    <>
    <div className="flex justify-center items-center">
    {/* Input element of type "file" to allow users to select a file */}
    <input
      type="file"
      onChange={handleChange}
      className="hidden" // Hide the actual file input
      id="fileInput" // Add an ID for the label's "for" attribute
    />

    {/* Label to style the custom file input */}
    <label
      htmlFor="fileInput"
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-l cursor-pointer"
    >
      Browse
    </label>

    {/* Button element to trigger the file upload */}
    <button
      onClick={handleUpload}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r"
    >
      Upload
    </button>

    {/* Display the selected file name */}
    
  </div>
  {selectedFile && <div className="ml-4 flex justify-center items-center">{selectedFile.name}</div>}
  { isUploading && <div className='flex justify-center items-center imageuploadloader'>
  <img srcSet={loaderImg} alt="loader"/>
  </div>}
  </>
  );
};

export default ImageUpload;
