import React from 'react'
import '../App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { defaultHeaders, API_BASE_URL, VACANTSEAT, bucket, folder, camera_folder, VISITSTART, VALIDATEAPI, LOGINAPI, AFTERVISIT } from '../config/config'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Webcam from "react-webcam";
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const videoConstraints = {
  width: 540,
  facingMode: 'environment'
}

const Heading1 = styled.h2`
font-family: 'Roboto', sans-serif;
font-weight: 700;
color: #007bff;
text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
letter-spacing: 0px;
justify-content: center;
margin-top: 2%;
width: 100%;
display:flex;

@media only screen and (max-width: 768px) { /* Tablet styles */
  margin-left: 15%;
  margin-top: 3%;
  width: 80%;
}
`;

const heading2 = styled.h2`
 

 font-family: 'Roboto', sans-serif;
font-weight: 700;
color: #007bff;
text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
letter-spacing: 1px;
`;

const StyledBox = styled.div`
background-color: #f8f9fa; /* Set background color */
border: 1px solid #ced4da; /* Add border */
border-radius: 10px; /* Add border radius */
width: 45%;
display: block; /* Add display property */
align-items: center;
justify-content: center;
@media only screen and (max-width: 768px) { /* Tablet styles */
  height:30vh;
}
`;
const StyledBox1 = styled.div`
background-color: #f8f9fa; /* Set background color */
border: 1px solid #ced4da; /* Add border */
border-radius: 10px; /* Add border radius */
width: 45%;
display: block; /* Add display property */
align-items: center;
justify-content: center;
padding:10px;
@media only screen and (max-width: 768px) { /* Tablet styles */
  height:40vh;
}
`;
const Wrapper = styled.div`
  position: relative;
  filter: ${(props) => (props.blur ? 'blur(5px)' : 'none')};
  transition: filter 0.3s ease;
  `;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: ${(props) => (props.show ? 'block' : 'none')};
`;
const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  z-index: 1001;
  display: ${(props) => (props.show ? 'block' : 'none')};
`;

const AuthFormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: auto;
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  
`;

const FormControl = styled.input`
  height: 40px;
  appearance: none;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  color: #333;
  font-size: 1rem;
  width: 100%;
  max-width: 300px;
  box-sizing: border-box;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 0.5rem 2.25rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   align-self:center;
  &:hover {
    background-color: #0056b3;
  }
`;


export default function Home() {
  const navigate = useNavigate();
  const [showFields, setShowFields] = useState(true);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false)
  const [customerType, setCustomerType] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCustomer, setShowCustomer] = useState(false)
  const [dropdown1, setDropdown1] = useState('');
  const [dropdown2, setDropdown2] = useState('');
  const webCamRef = useRef(null)
  const [url, setUrl] = useState(null)
  const [table, settable] = useState([])
  const [people, setPeople] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [loading3, setLoading3] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/')
    }
    console.log("hello", process.env);
  }, [])

  useEffect(() => {
    vacantSeat()
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      const refreshToken = localStorage.getItem('refresh_token');
      refreshTokens(refreshToken);
      // console.log("i am calling");
    }, 3550000);
    return () => clearInterval(intervalId);
  }, []);


  const refreshTokens = (refreshToken) => {
    const phone = localStorage.getItem('phone_no');
    axios.post(LOGINAPI, {
      phone_number: phone,
      refresh_token: refreshToken,
    }, { mode: 'cors' })
      .then(function (response) {
        const token = response.data.security_tokens.idToken;
        const refreshToken = response.data.security_tokens.refreshToken;
        localStorage.setItem('token', token);
        localStorage.setItem('refresh_token', refreshToken);
      })
      .catch(function (error) {
        console.error('error', error);
        toast('Failed to verify', {
          autoClose: 500,
          hideProgressBar: true
        })

      });
  }

  const logoutPage = () => {
    navigate('/')
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('branch_id');
    localStorage.removeItem('property_folder');
    localStorage.removeItem('phone_no');
    localStorage.removeItem('image_path');
    localStorage.removeItem('face_id')
    localStorage.removeItem('cus_id')
    localStorage.removeItem('recog')
    setUrl('')

  }


  const capturePhoto = useCallback(async () => {
    const imageSrc = webCamRef.current.getScreenshot()
    setUrl(imageSrc)
  }, [webCamRef]);

  const onUsermedia = (e) => {
    console.log(e);
  }

  


  const apiDataCall = () => {
    console.log('entered');
    setLoading(true)
    const propertyFolder = localStorage.getItem('property_folder');
    const token = localStorage.getItem('token');
    console.log("helllooo", propertyFolder, token);
    function generateRandomString(length) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }

    const randomFilename = `Molecule${generateRandomString(7)}.jpg`;
    console.log(url);
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
        headers: {
          'Content-Type': 'image/jpeg',
          'Authorization': `Bearer ${token}`
        },
        params: {
          bucket: bucket,
          property_folder: propertyFolder,
          qt_folder: folder,
          camera_folder: camera_folder,
          filename: randomFilename,
        },
        data: bytes.buffer,
      }).then(response => {
        console.log('yyyyyyyy',response.data);
        if (response.data.message.face_features.age_range[0] > 21) {

          if (response.data.message.recognition == 'Person not recognized') {
            console.log('Done', response.data);
            const path = response.data.message.image_path;
            const cus_id = response.data.message.customer_id;
            const face_id = response.data.message.face_id;
            const recoz = 'Person not recognized'
            localStorage.setItem('recog', recoz)
            localStorage.setItem('image_path', path)
            localStorage.setItem('face_id', face_id)
            localStorage.setItem('cus_id', cus_id)
            toast("Image upload successful", {
              autoClose: 500,
              hideProgressBar: true
            });
            setShowFields(true)
            setLoading(false)
          }
          // console.log(response.data.message.face_features.age_range[0],'ttttttttttttt');
          if (response.data.message.recognition == 'Person recognized') {
            const path = response.data.message.image_path;
            const cus_id = response.data.message.customer_id;
            const face_id = response.data.message.face_id;
            const recoz = 'Person recognized'
            localStorage.setItem('image_path', path)
            localStorage.setItem('face_id', face_id)
            localStorage.setItem('cus_id', cus_id)
            localStorage.setItem('recog', recoz)
            toast("You are valueable customer", {
              autoClose: 500,
              hideProgressBar: true
            });
            console.log(response.data);
            setName(response.data.message.name)
            setCustomerType(response.data.message.customer_type)
            setPhoneNumber(response.data.message.phone)
            setLoading(false)
          }
        } else {
          setLoading(false)
          setShowPopup(true)

        }

        // console.log('Image upload successful:', response.data);
      }).catch(error => {
        console.error('Error uploading image:', error);
        toast('Error Uploading Image', {
          autoClose: 500,
          hideProgressBar: true
        })
        setLoading(false)
      });

    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading2(true)
    const branch = localStorage.getItem('branch_id');
    const property = localStorage.getItem('property_folder');
    const image = localStorage.getItem('image_path');
    const cus_id = localStorage.getItem('cus_id');
    const face_id = localStorage.getItem('face_id');
    const recognize = localStorage.getItem('recog');
    // console.log(phoneNumber,url,name);
    //   console.log(branch, property, image);
    if(!name || !phoneNumber || !people){
      toast('Please fill all fields', {
        autoClose: 500,
        hideProgressBar: true,
      })
      setLoading2(false)
    }else{
    if(url){
    axios.post(VISITSTART, {

      branch_id: branch,
      property_folder: property,
      customer_name: name,
      phone: phoneNumber,
      image_path: image,
      party_size: people,
      customer_id: cus_id,
      face_id: face_id,
      recognition: recognize,
      table_id:'False',
      table_number:'False',
      staff_id:'False'
    },
      {

        headers: { 'Content-Type': 'application/json', },
        // withCredentials: true

      })
      .then(function (response) {
        toast('Visit Started', {
          autoClose: 500,
          hideProgressBar: true,
        })
        setLoading2(false)
        // console.log('data', response.data);
        // setShowFields(false)
        // setShowCustomer(true)


      })
      .catch(function (error) {
        // console.error('error', error);
        toast('Failed to verify', {
          autoClose: 500,
          hideProgressBar: true
        })
        setLoading2(false)

      });
    }else{
      axios.post(VISITSTART, {

        branch_id: branch,
        property_folder: property,
        customer_name: name,
        phone: phoneNumber,
        image_path: 'False',
        party_size: people,
        customer_id: 'False',
        face_id: 'False',
        recognition: recognize,
        table_id:'False',
        table_number:'False',
        staff_id:'False'
      },
        {
  
          headers: { 'Content-Type': 'application/json', },
          // withCredentials: true
  
        })
        .then(function (response) {
          toast('Visit Started', {
            autoClose: 500,
            hideProgressBar: true,
          })
          setLoading2(false)
          // console.log('data', response.data);
          // setShowFields(false)
          // setShowCustomer(true)
  
  
        })
        .catch(function (error) {
          console.error('error', error.response);
          toast('Failed to verify', {
            autoClose: 500,
            hideProgressBar: true
          })
          setLoading2(false)
  
        });
    }
  }
  }

  const vacantSeat = () => {
    const branch = localStorage.getItem('branch_id');
    axios({
      method: 'get',
      url: VACANTSEAT,
      params: {
        branch_id: branch,
      },
    }).then(response => {

      console.log('Image upload successful:', response.data);
      settable(response.data)
    }).catch(error => {
      console.log('Error', error);
    });

  }

  const handleRefresh = () => {
    apiDataCall()
  }
  const onSkip = () => {
    setShowCustomer(false)
    setShowFields(true)
    setName('')
    setPhoneNumber('')
    setUrl('')
    setDropdown1('')
    setDropdown2('')
  }

  const afterVisit = () => {
    setLoading3(true)
    axios.post(AFTERVISIT, {
      "staff_id": "server1",
      "table_id": '1',
      "visit_id": '1',
    }, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(function (response) {
        toast('Success', {
          autoClose: 500,
          hideProgressBar: true
        })
        setLoading3(false)
        setUrl('')
        setPeople('')
        setName('')
        setCustomerType('')
        setPhoneNumber('')

        console.log(response.data);

      })
      .catch(function (error) {
        console.error('error', error);
        toast('Failed', {
          autoClose: 500,
          hideProgressBar: true
        })
        setLoading3(false)
      }).finally(() => {
        setLoading3(false)
      });
  }

  const trueCount = table.reduce((acc, staff) => (
    acc + staff.tables.filter(table => table.table_status === 'true').length
  ), 0);

  const falseCount = table.reduce((acc, staff) => (
    acc + staff.tables.filter(table => table.table_status === 'false').length
  ), 0);

  const handleAllClear=()=>{
    setName('')
    setPhoneNumber('')
    setPeople('')
    setUrl('')
  }

  return (
    <>
      <div>
        <Wrapper blur={showPopup}>
          <div className="container">

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2%' }}>
              <h2 style={{
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 700,
                color: '#007bff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
                letterSpacing: '1px',
              }}>Welcome to Reception</h2>
              <button onClick={logoutPage} style={{ backgroundColor: '#007bff', border: 'none', borderRadius: 8, padding: 7, color: 'white', position: 'absolute', right: 20 }}>Logout</button>
            </div>


            <div className="row">
              <div style={{ justifyContent: 'space-between', display: 'flex', marginTop: '3%' }}>
                <StyledBox>
                  <Heading1>Customer Verify</Heading1>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '3%' }}>
                    <div style={{ width: '85%', height: '60%', display: 'flex', justifyContent: 'center' }}>
                      <Webcam
                        style={{ width: '90%', height: '90%', borderRadius: 50 }}
                        audio={false}
                        ref={webCamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        onUserMedia={onUsermedia}
                        mirrored={true}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {url && (
                        <div style={{ width: '80%', height: '60%', }}>
                          <img src={url} alt="Screenshot" className="img-fluid" style={{ borderRadius: 30 }} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row" style={{ marginTop: '3%', marginBottom: '3%', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="col-md-6 d-flex justify-content-between align-items-center">
                      <button className="btn btn-primary" style={{ flex: 1, marginRight: 3 }} onClick={capturePhoto}>
                        Capture
                      </button>
                      <button className="btn btn-primary" style={{ flex: 1, marginLeft: 3, position: 'relative' }} onClick={handleRefresh} disabled={loading}>
                        Submit
                        {loading && (
                          <div style={{
                            width: '20px',
                            height: '20px',
                            border: '3px solid #f3f3f3', /* Light grey */
                            borderTop: '3px solid #3498db', /* Blue */
                            borderRadius: '50%',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-10px',
                            marginLeft: '-10px',
                            animation: 'spin 1s linear infinite' /* Add spinning animation */
                          }}></div>
                        )}
                      </button>
                      <style>
                        {`
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `}
                      </style>
                    </div>
                  </div>
  
                </StyledBox>
                <div className="col-md-1" style={{ justifyContent: 'center', alignItems: 'center', }}>
                  <div style={{ borderLeft: '1px solid #000', height: '100%', marginLeft: '50%' }}></div>
                </div>

                <StyledBox1>

                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 2%' }}>
                    <h2 style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: 700,
                      color: '#007bff',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
                      letterSpacing: '0px', marginTop: '4%'
                    }}>Customer Details</h2>
                    <h4>Customer Type: {customerType}</h4>
                    {/* Left Side: URL */}


                    {/* Right Side: Form */}

                  </div>
                  <div className="form-container md-5" style={{}}>

                    <form >
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
                        <label htmlFor="customerId">Customer Phone:</label>
                        <input
                          type="text"
                          id="customerId"
                          name="customerId"
                          className="form-control"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="customerId">Number of People:</label>
                        <input
                          type="text"
                          id="customerId"
                          name="customerId"
                          className="form-control"
                          value={people}
                          onChange={(e) => setPeople(e.target.value)}
                          required
                        />
                      </div>
                      <div className="text-center">
                        <button className="btn btn-primary mt-4" style={{ position: 'relative' }} onClick={handleSubmit} disabled={loading2}>
                          Add Visit
                          {loading2 && (
                            <div style={{
                              width: '20px',
                              height: '20px',
                              border: '3px solid #f3f3f3', /* Light grey */
                              borderTop: '3px solid #3498db', /* Blue */
                              borderRadius: '50%',
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              marginTop: '-10px',
                              marginLeft: '-10px',
                              animation: 'spin 1s linear infinite' /* Add spinning animation */
                            }}></div>
                          )}
                        </button>
                        <style>
                          {`
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `}
                        </style>
                        <button className="btn btn-primary mt-4 " style={{marginLeft:5}} onClick={handleAllClear}>
                          Refresh
                        </button>
                      </div>
                    </form>
                  </div>


                </StyledBox1>

              </div>

              <div style={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: '#FFFFFF',
                marginTop: 15,
                marginBottom: 10
              }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
                  <p style={{
                    marginRight: 20, fontFamily: "'Roboto', sans-serif",
                    fontWeight: 700,
                    color: '#fc5f51',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
                    letterSpacing: '0px'
                  }}>Booked: {trueCount}</p>
                  <p style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: 700,
                    color: '#a9f5bd',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
                    letterSpacing: '0px'
                  }}>Vacant: {falseCount}</p>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(8, 1fr)',
                    marginBottom: '10px',
                    gap: '10px',
                    padding: '10px',
                    backgroundColor: '#FFFFFF',
                    height: '200px',
                    overflowY: 'auto',
                  }}>

                    {table.map((staff) =>

                      staff.tables.map((table) => (
                        <div key={table.id} style={{
                          width: '120px',  // Increase size
                          height: '80px', // Increase size
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #ccc',
                          borderRadius: '5px',
                          backgroundColor: table.table_status == 'true' ? '#fc5f51' : '#a9f5bd',
                          fontSize: '20px',
                        }}>
                          <p style={{
                            margin: '0',
                            fontWeight: 'bold',
                            textAlign: 'center'
                          }}> {table.table_number}</p>
                          <p style={{
                            margin: '0',

                            textAlign: 'center'
                          }}> {table.table_status == 'true' ? 'Booked' : 'Vacant'}</p>
                        </div>
                      ))
                    )}

                 
                  </div>
                </div>
              </div>
            </div>
          

            <ToastContainer
            />
          </div>
        </Wrapper>
        <Overlay show={showPopup} onClick={() => setShowPopup(false)} />
        <PopupContainer show={showPopup}>
          <AuthFormContainer>

            <div style={{ textAlign: 'center' }}>
              <p>It appears that you might be under the legal drinking age.</p>
              <button className="btn btn-primary" onClick={(e) => {
                e.preventDefault();
                setShowPopup(false);
              }}>
                OK
              </button>
            </div>

          </AuthFormContainer>
        </PopupContainer>
      </div>

    </>

  )
}
//branch id , property folder ,response=> customer_id,name,phone and image path in api
//s3://face-mementos/qt_faces/molecule/camera_1/Molecule_1.jpg


