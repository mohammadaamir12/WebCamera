import React from 'react'
import '../App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { defaultHeaders, API_BASE_URL, VACANTSEAT,bucket,folder,camera_folder,VISITSTART, VALIDATEAPI, LOGINAPI, AFTERVISIT } from '../config/config'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Webcam from "react-webcam";
import {useNavigate} from 'react-router-dom';

const videoConstraints = {
  width: 540,
  facingMode: 'environment'
}

export default function Home() {
  const navigate=useNavigate();
  const [showFields, setShowFields] = useState(false);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false)
  const [customerId, setCustomerId] = useState('False');
  const [customerType, setCustomerType] = useState('');
  const [showCustomer, setShowCustomer] = useState(false)
  const [dropdown1, setDropdown1] = useState('');
  const [dropdown2, setDropdown2] = useState('');
  const webCamRef = useRef(null)
  const [url, setUrl] = useState(null)
  const [table, settable] = useState([])
  const [people,setPeople]=useState('')

  useEffect(() => {
    vacantSeat()
  }, [])

  setInterval(()=>{
   const refreshToken=localStorage.getItem('refresh_token');
   refreshTokens(refreshToken);
  },3550000);

  const refreshTokens=(refreshToken)=>{
    const phone=localStorage.getItem('phone_no');
    axios.post(LOGINAPI, {
      phone_number:phone,
      refresh_token:refreshToken,
  },{mode:'cors'})
      .then(function (response) {
          const token = response.data.security_tokens.idToken;
          const refreshToken=response.data.security_tokens.refreshToken;
          localStorage.setItem('token', token);
          localStorage.setItem('refresh_token', refreshToken);
      })
      .catch(function (error) {
          console.error('error', error);
          toast('Failed to verify')
          
      });
  }

  const logoutPage=()=>{
  navigate('/')
  localStorage.removeItem('token')
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('branch_id');
  localStorage.removeItem('property_folder');
  localStorage.removeItem('phone_no');
  localStorage.removeItem('image_path');
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
    const propertyFolder = localStorage.getItem('property_folder');
    const token = localStorage.getItem('token');
    console.log("helllooo",propertyFolder,token);
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
        headers:{'Content-Type': 'image/jpeg',
        'Authorization': `Bearer ${token}`},
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
          const path=response.data.message.image_path;
          localStorage.setItem('image_path',path)
          toast("Image upload successful");
          setShowFields(true)

        }
        if (response.data.message.recognition == 'Person recognized') {
          console.log('Done');
          const path=response.data.message.image_path;
          localStorage.setItem('image_path',path)
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

  const handleSubmit = (e) => {
    e.preventDefault();
   const branch= localStorage.getItem('branch_id');
   const property= localStorage.getItem('property_folder');
   const image= localStorage.getItem('image_path');
    if (!name && !customerType && !customerId) {
      setNameError('Name is required');
      return;
    }
    
    else {
      console.log(branch,property,image);
      axios.post(VISITSTART, {
        
          branch_id: branch,
          property_folder: property,
          customer_id: customerId,
          customer_name: name,
          phone: customerType,
          image_path: image
      
    },
    {
      headers: { 'Content-Type': 'application/json' }
  })
        .then(function (response) {
            toast('Visit Started')
            console.log('data',response.data);
            setShowFields(false)
            setShowCustomer(true)

           
        })
        .catch(function (error) {
            console.error('error', error);
            toast('Failed to verify')
            
        });
     
    }
  }

  const vacantSeat = () => {
    const branch=localStorage.getItem('branch_id');
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

  const handleRefresh=()=>{
    setUrl('')
    setShowFields(false)
    setShowCustomer(false)
  }
  const onSkip=()=>{
    setShowCustomer(false)
    setShowFields(false)
    setName('')
    setCustomerId('False')
    setCustomerType('')
    setUrl('')
    setDropdown1('')
    setDropdown2('')
  }

  const afterVisit=()=>{
    axios.post(AFTERVISIT, {
      "staff_id": "server1",
      "table_id": '1',
      "visit_id":'1',
  },{
    headers: { 'Content-Type': 'application/json' }
})
      .then(function (response) {
          toast('Success',response.data)
         
      })
      .catch(function (error) {
          console.error('error', error);
          toast('Failed')
      }).finally(() => {
         
      });
  }

  return (
    <>
      <div className="container">
        <h2 className="mb-2 mt-2" style={{
          fontFamily: "'Roboto', sans-serif",
          fontWeight: 700,
          color: '#007bff',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
          letterSpacing: '1px'
        }}>Take Your Photo</h2>

        <div className="row">
          <div className="col-md-4">
            <div className="row">
              <div className="col-auto">
                <Webcam
                  style={{ width: '100%', height: '100%',borderRadius:50 }}
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
                <button className="btn btn-primary mr-3" style={{ margin: 20 }} onClick={capturePhoto}>
                  Capture
                </button>
                <button className="btn btn-secondary"  onClick={handleRefresh}>
                  Refresh
                </button>
              </div>
            </div>
          </div>
          {url && (
            <div className="col-md-2 " style={{ marginTop: '7%',}}>
              <img src={url} alt="Screenshot" className="img-fluid" style={{borderRadius:30}} />
            </div>
          )}
          <div className="col-md-1 d-flex align-items-center ">
            <div style={{ borderLeft: '1px solid #000', height: '100%', margin: '0 auto' }}></div>
          </div>

          <div className="col-md-4 offset-md-1">
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
                    <label htmlFor="customerId">Customer Phone:</label>
                    <input
                      type="text"
                      id="customerId"
                      name="customerId"
                      className="form-control"
                      value={customerType}
                      onChange={(e) => setCustomerType(e.target.value)}
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
                    />
                  </div>




                  <div className="text-center">
                    <button type="submit" className="btn btn-primary mt-4">
                      Add Visit
                    </button>
                  </div>
                </form>
              </div>
            )}

            {showCustomer && (
                        <div>
                        <div style={{ display: 'flex', justifyContent: "space-between"}}>
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
          </div>

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
     <div style={{ display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh', }}>
    <div style={{ display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    marginTop: '10px',
    marginBottom:'10px',
    gap: '10px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#FFFFFF',
    height: '200px',
    overflowY: 'auto',
    }}>
      {table.map((staff) =>
        staff.tables.map((table) => (
          <div key={table.id} style={{width: '120px',  // Increase size
          height: '80px', // Increase size
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #ccc',
          borderRadius: '5px',
          backgroundColor:table.table_status=='true'?'#cfdae8':'#fc5f51',
          fontSize: '20px',}}>
           <p style={{margin:'0',
                      fontWeight: 'bold',
                      textAlign:'center'}}> {table.table_number}</p>
           <p style={{margin:'0',
                      
                      textAlign:'center'}}> {table.table_status=='true'?'Vacant':'Booked'}</p>
          </div>
        ))
      )}
    </div>
    </div>
        </div>
        <h1 onClick={logoutPage}>Logout</h1>

        <ToastContainer />
      </div>


    </>

  )
}
//branch id , property folder ,response=> customer_id,name,phone and image path in api
//s3://face-mementos/qt_faces/molecule/camera_1/Molecule_1.jpg

  
