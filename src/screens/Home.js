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


export default function Home() {
  const navigate = useNavigate();
  const [showFields, setShowFields] = useState(true);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false)
  const [customerId, setCustomerId] = useState('False');
  const [customerType, setCustomerType] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCustomer, setShowCustomer] = useState(false)
  const [dropdown1, setDropdown1] = useState('');
  const [dropdown2, setDropdown2] = useState('');
  const webCamRef = useRef(null)
  const [url, setUrl] = useState(null)
  const [table, settable] = useState([])
  const [people, setPeople] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/')
    }

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
    setUrl('')

  }

  // const containerStyle = {
  //   width:'100%',
  //   backgroundColor: '#ebf0f5',
  //   padding: '20px',
  //   borderRadius: '8px',
  //   justifyContent:'center',
  //   alignItems:'center'

  // };

  // const boxStyle = {
  //   height: '100px',
  //   backgroundColor: '#bfd1e3',
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   border: '1px solid #84a2bf',
  //   borderRadius: '4px',
  //   fontSize: '14px',
  // }

  // const rows = Array.from({ length: 4 }, (_, rowIndex) => (
  //   <div className="row mb-2" key={rowIndex}>
  //     {Array.from({ length: 6 }, (_, colIndex) => (
  //       <div className="col-md-2 mb-2" key={colIndex}>
  //         <div style={boxStyle}>
  //           Box {rowIndex * 6 + colIndex + 1}
  //         </div>
  //       </div>
  //     ))}
  //   </div>
  // ));

  const capturePhoto = useCallback(async () => {
    const imageSrc = webCamRef.current.getScreenshot()
    setUrl(imageSrc)
  }, [webCamRef]);

  const onUsermedia = (e) => {
    console.log(e);
  }

  // useEffect(() => {
  //   if (url) {

  //     apiDataCall();
  //   }
  // }, [url]);


  const apiDataCall = () => {
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
        if (response.data.message.recognition == 'Person not recognized') {
          console.log('Done', response.data);
          const path = response.data.message.image_path;
          localStorage.setItem('image_path', path)
          toast("Image upload successful", {
            autoClose: 500,
            hideProgressBar: true
          });
          setShowFields(true)

        }
        console.log(response.data.message.face_features.age_range[0],'ttttttttttttt');
        if (response.data.message.recognition == 'Person recognized') {
          if(response.data.message.face_features.age_range[0]<=21){
            toast("Please Verify Your Age", {
              autoClose: 1000,
              hideProgressBar: true,
              backgroundColor:'red'
            });
          } else{
            const path = response.data.message.image_path;
          localStorage.setItem('image_path', path)
          toast("Image recognize successfully", {
            autoClose: 500,
            hideProgressBar: true
          });
          console.log(response.data);
          setName(response.data.message.name)
          setCustomerId(response.data.message.customer_id)
          setCustomerType(response.data.message.customer_type)
          setPhoneNumber(response.data.message.phone)
          }
          
        }
        // console.log('Image upload successful:', response.data);
      }).catch(error => {
        console.error('Error uploading image:', error);
        toast('Token expired', {
          autoClose: 500,
          hideProgressBar: true
        })
      });

    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const branch = localStorage.getItem('branch_id');
    const property = localStorage.getItem('property_folder');
    const image = localStorage.getItem('image_path');
    if (!name && !phoneNumber && !customerId && !url) {
      toast('First Capture Image and Enter details', {
        autoClose: 500,
        hideProgressBar: true
      });
      return;
    }

    else {
      console.log(branch, property, image);
      axios.post(VISITSTART, {

        branch_id: branch,
        property_folder: property,
        customer_id: customerId,
        customer_name: name,
        phone: phoneNumber,
        image_path: image,
        party_size: people

      },
        {
          headers: { 'Content-Type': 'application/json' }
        })
        .then(function (response) {
          toast('Visit Started', {
            autoClose: 500,
            hideProgressBar: true,
            style: {
              backgroundColor: 'green', // Example background color
            }
          })
          console.log('data', response.data);
          setShowFields(false)
          setShowCustomer(true)


        })
        .catch(function (error) {
          console.error('error', error);
          toast('Failed to verify', {
            autoClose: 500,
            hideProgressBar: true
          })

        });

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
    setCustomerId('False')
    setPhoneNumber('')
    setUrl('')
    setDropdown1('')
    setDropdown2('')
  }

  const afterVisit = () => {
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
        console.log(response.data);

      })
      .catch(function (error) {
        console.error('error', error);
        toast('Failed', {
          autoClose: 500,
          hideProgressBar: true
        })
      }).finally(() => {

      });
  }

  const trueCount = table.reduce((acc, staff) => (
    acc + staff.tables.filter(table => table.table_status === 'true').length
  ), 0);

  const falseCount = table.reduce((acc, staff) => (
    acc + staff.tables.filter(table => table.table_status === 'false').length
  ), 0);

  return (
    <>
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

        {/* <heading2 className="mb-2 mt-2"
        >Smile Please</heading2> */}

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
      <div style={{ width: '80%', height: '60%',}}>
        <img src={url} alt="Screenshot" className="img-fluid" style={{ borderRadius: 30 }} />
      </div>
    )}
  </div>
</div>
              <div className="row" style={{ marginTop: '3%',marginBottom:'3%',alignItems:'center',justifyContent:'center' }}>
                <div className="col-md-6 d-flex justify-content-between align-items-center">
                  <button className="btn btn-primary" style={{flex:1,marginRight:3  }} onClick={capturePhoto}>
                    Capture
                  </button>
                  <button className="btn btn-primary" style={{ flex:1,marginLeft:3}} onClick={handleRefresh}>
                    Submit
                  </button>
                </div>
              </div>
              {/* <div className="row">
    <div className="col-md-3">
      <div className="row">
        <div className="col-auto">
          <Webcam
            style={{ width: '100%', height: '100%', borderRadius: 50 }}
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
        <div className="col-md-6 d-flex justify-content-between align-items-center">
          <button className="btn btn-primary mr-md-3" style={{ margin: 20 }} onClick={capturePhoto}>
            Capture
          </button>
          <button className="btn btn-primary" onClick={handleRefresh}>
            Submit
          </button>
        </div>
      </div>
    </div>
    {url && (
      <div className="col-md-2" style={{ width: '20%', height: '20%', marginTop: '2.5%' }}>
        <img src={url} alt="Screenshot" className="img-fluid" style={{ borderRadius: 30 }} />
      </div>
    )}
  </div> */}
            </StyledBox>
            <div className="col-md-1" style={{ justifyContent: 'center', alignItems: 'center', }}>
              <div style={{ borderLeft: '1px solid #000', height: '100%', marginLeft: '50%' }}></div>
            </div>

           <StyledBox1>
            
  <div style={{display:'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 2%' }}>
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
  <div className="form-container md-5" style={{  }}>
    
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
        <button type="submit" className="btn btn-primary mt-4">
          Add Visit
        </button>
      </div>
    </form>
  </div>

  {/* Showing Customer */}
  {showCustomer && (
    <div style={{}}>
      <div style={{ display: 'flex', justifyContent: "space-between", }}>
        <div className="form-group">
          <label htmlFor="dropdown1">Staff:</label>
          <select
            id="dropdown1"
            name="dropdown1"
            className="form-control"
            value={dropdown1}
            onChange={(e) => setDropdown1(e.target.value)}
          >
            <option value="">Select an option</option>
            <option value="option1">1</option>
            <option value="option2">2</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dropdown2">Table:</label>
          <select
            id="dropdown2"
            name="dropdown2"
            className="form-control"
            value={dropdown2}
            onChange={(e) => setDropdown2(e.target.value)}
          >
            <option value="">Select an option</option>
            <option value="option1">1</option>
            <option value="option2">2</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: "center", marginTop: '20px' }}>
        <div className="text-center">
          <button onClick={afterVisit} type="submit" className="btn btn-primary mx-2">
            Submit
          </button>
        </div>
        <div className="text-center">
          <button onClick={onSkip} type="button" className="btn btn-primary mx-2">
            Skip
          </button>
        </div>
      </div>
    </div>
  )}
</StyledBox1>

          </div>

          {/* <div className="col-md-1" style={{ borderLeft: '1px solid #000', height: '100%', margin: '0 auto' }}></div> */}



          {/* <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px', marginTop: 20
          }}>
            {table.map((item, index) => (
              <div key={index} style={{
                border: '1px solid #ccc',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                width: '300px',
                marginBottom:5
              }}>
                <p>Staff Name:- {item.name}</p>
                <p>Staff ID:- {item.staffid}</p>
                {item.tables.map((table, idx) => (
                  <div key={idx} style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    borderRadius: '8px',
                    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
                    width: '100px',
                    backgroundColor:table.table_status=='true'?'#cafad3':'#fc5858',
                    margin:5
                    
                  }}>
                    <p style={{
                      margin: '0',
                      fontWeight: 'bold',
                      textAlign: 'center'
                      
                    }}>{table.table_status=='true'?'Vacant':'Booked'}</p>
                    <p style={{
                      margin: '0',
                      fontWeight: 'bold',
                      textAlign:'center'
                    }}>{table.table_number}</p>
                  </div>
                ))}
              </div>
            ))}
          </div> */}
          {/* <div style={{ display: 'flex',
    flexDirection: 'column',
    gap: '20px',}}>
      {table.map((staff, index) => (
        <div key={index} style={{padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',}}>
          <h3>{staff.name}</h3>
          <div style={{display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '10px',}}>
            {staff.tables.map((table) => (
              <div key={table.id} style={{ width: '40px',
              height: '40px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid #ccc',
              borderRadius: '5px',
              backgroundColor: '#f0f0f0',}}>
                {table.table_number}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div> */}
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

                {/* <div>
    <p>Total True: {trueCount}</p>
    <p>Total False: {falseCount}</p>
    {table.map((staff) => (
      <div key={staff.staffid}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {staff.tables.map((table) => (
            <div
              key={table.id}
              style={{
                width: '120px',
                height: '80px',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: table.table_status === 'true' ? '#a9f5bd' : '#fc5f51',
                fontSize: '20px',
                margin: '5px',
              }}
            >
              <p style={{ margin: '0', fontWeight: 'bold', textAlign: 'center' }}>
                {table.table_number}
              </p>
              <p style={{ margin: '0', textAlign: 'center' }}>
                {table.table_status === 'true' ? 'Vacant' : 'Booked'}
              </p>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div> */}
              </div>
            </div>
          </div>
        </div>
        {/* <h1 onClick={logoutPage}>Logout</h1> */}

        <ToastContainer
        />
      </div>


    </>

  )
}
//branch id , property folder ,response=> customer_id,name,phone and image path in api
//s3://face-mementos/qt_faces/molecule/camera_1/Molecule_1.jpg


