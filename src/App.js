import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { defaultHeaders, API_BASE_URL } from './config/config'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Webcam from "react-webcam";

const videoConstraints = {
  width: 540,
  facingMode: 'environment'
}

function App() {
  const [showFields, setShowFields] = useState(false);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false)
  const [customerId, setCustomerId] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [showCustomer, setShowCustomer] = useState(false)
  const webCamRef = useRef(null)
  const [url, setUrl] = useState(null)

  const capturePhoto = useCallback(async () => {
    const imageSrc = webCamRef.current.getScreenshot()
    setUrl(imageSrc)
    apiDataCall()
  }, [webCamRef]);

  const onUsermedia = (e) => {
    console.log(e);
  }

  useEffect(() => {
    if (url) {
      apiDataCall();
    }
  }, [url]);


  const apiDataCall = () => {
    console.log("hello")
    if (url) {
      const binaryString = atob(url.split(',')[1]);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      console.log("hello", bytes.buffer);
      // Send the image data to API endpoint using Axios
      axios({
        method: 'put',
        url: API_BASE_URL,
        headers: defaultHeaders,
        params: {
          bucket: 'face-mementos',
          property_folder: 'molecule_club_ifc',
          qt_folder: 'qt_faces',
          camera_folder: 'camera_1',
          filename: 'Molecule_Cam1_1.jpg',
        },
        data: bytes.buffer,
      }).then(response => {
        if (response.data.message.recognition == 'Person not recognized') {
          console.log('Done');
          toast("Image upload successful");
          setShowFields(true)
        }
        if (response.data.message.recognition == 'Person recognized') {
          console.log('Done');
          toast("Image upload successful");
          setShowCustomer(true)
          setName(response.data.message.name)
          setCustomerId(response.data.message.customer_id)
          setCustomerType(response.data.message.customer_type)
        }
        // console.log('Image upload successful:', response.data);
      }).catch(error => {
        console.error('Error uploading image:', error);
        toast('Token expired')
      });

    }
  }

  // form sending point or function
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      setNameError('Name is required');
      return;
    }
    else {
      toast("Submitted");
      setShowFields(false)
      setUrl(null)
      setName('')
      setCustomerId('')
      setCustomerType('')
    }
  }


  return (
    <>
    <div className="container">
      <h1 className="mb-4">Take Your Selfie</h1>

      <div className="row ">
        <div className="col-md-6 ">
          <div className="row">
            <div className="col-auto" style={{width:'70%',height:'80%'}}>
              <Webcam
                style={{ width: '100%', height: '100%',backgroundColor:'#000' }}
                audio={false}
                ref={webCamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onUserMedia={onUsermedia}
                mirrored={true}
              />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <button className="btn btn-primary mr-3" onClick={capturePhoto}>Capture</button>
              <button className="btn btn-secondary" onClick={() => setUrl(null)}>Refresh</button>
            </div>
          </div>

          {url && (
            <div className="row mt-3">
              <div className="col">
                <img src={url} alt="Screenshot" className="col-auto" style={{width:'60%',height:'80%'}} />
              </div>
            </div>
          )}
        </div>

        <div className="col-md-6">
          {showFields && (
            <div className="form-container mb-5">
              <h2 className="mb-3">Provide Customer Information</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="customerId">Customer ID:</label>
                  <input
                    type="text"
                    id="customerId"
                    name="customerId"
                    className="form-control"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="customerType">Customer Type:</label>
                  <input
                    type="text"
                    id="customerType"
                    name="customerType"
                    className="form-control"
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value)}
                  />
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary mt-4">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          )}

          {showCustomer && (
            <div className="mt-3">
              <h2>Customer Details</h2>
              <p>Name: {name}</p>
              <p>Customer ID: {customerId}</p>
              <p>Customer Type: {customerType}</p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>


    </>



  );
}

export default App;
