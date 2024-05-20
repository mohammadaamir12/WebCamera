import React from 'react'
import '../App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { defaultHeaders, API_BASE_URL } from '../config/config'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Webcam from "react-webcam";

const videoConstraints = {
    width: 540,
    facingMode: 'environment'
}

export default function Home() {
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
                <h2 className="mb-2 mt-2" style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: 700,
                    color: '#007bff',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
                    letterSpacing: '1px'
                }}>Take Your Photo</h2>

                <div className="row ">
                    <div className="col-md-4">
                        <div className="row" >
                            <div className="col-auto" >
                                <Webcam
                                    style={{ width: '100%', height: '100%', }}
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
                                <button className="btn btn-primary mr-3" style={{ margin: 5 }} onClick={capturePhoto}>Capture</button>
                                <button className="btn btn-secondary" style={{ margin: 5 }} onClick={() => setUrl(null)}>Refresh</button>
                            </div>
                        </div>
                    </div>
                    {url && (
                        <div className="col-md-3 mt-2">
                            <img src={url} alt="Screenshot" className="img-fluid" />
                        </div>
                    )}
                    <div className="col-md-1 d-flex align-items-center">
                        <div style={{ borderLeft: '1px solid #000', height: '100%', margin: '0 auto' }}></div>
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

    )
}
