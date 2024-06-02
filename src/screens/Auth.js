import '../App.css'
import React, { useState } from 'react';
import axios from 'axios';
import { LOGINAPI, VALIDATEAPI } from '../config/config'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'


export default function Auth({setAuth}) {
    const navigate = useNavigate();
    const [number, setNumber] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('')
    const [session,setSession]=useState('')
    const [userId,setUserId]=useState('')
    const [loading, setLoading] = useState(false); 

    const handleNumberChange = (value) => {
        const formattedValue = `+${value}`;
        setNumber(formattedValue);

    };
    const handleOtpChange = (e) => {
        setOtp(e.target.value)
    }


    const handleNumberSubmit = (e) => {
        e.preventDefault();
        console.log('i am here numbr',number);
        if (number != '') {
            setLoading(true);
            axios.post(LOGINAPI, {
                phone_number: number,
                refresh_token:"False"
            })
                .then(function (response) {
                    toast('Successfully Otp sent',{
                        autoClose: 500,
                        hideProgressBar: true
                    })
                    setSession(response.data.session)
                    setUserId(response.data.challengeParameters.USERNAME)
                    console.log('Successfully Otp sent:', response.data);
                })
                .catch(function (error) {
                    console.error('error', error);
                    toast('Failed',{
                        autoClose: 500,
                        hideProgressBar: true
                    })
                }).finally(() => {
                    setLoading(false); 
                });
        }
        console.log('Number submitted:', number);

        setShowOtp(true);
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(userId);
        console.log(session);
        console.log(otp);
        if (otp != '') {
            axios.post(VALIDATEAPI, {
                phone_number:number,
                session: session,
                challengeParameters: {
                    USERNAME:userId,
                    answer: otp
                },
            },{mode:'cors'})
                .then(function (response) {
                    setLoading(false);
                    toast('Success',{
                        autoClose: 500,
                        hideProgressBar: true
                    })
                    setAuth(true)
                    const token = response.data.security_tokens.idToken;
                    console.log('token given',token);
                    const refreshToken=response.data.security_tokens.refreshToken;
                    const branchId=response.data.details.branchid;
                    const propertyFolder=response.data.details.property_folder;
                    const phoneNumber=response.data.details.phone;
                    localStorage.setItem('token', token);
                    localStorage.setItem('refresh_token', refreshToken);
                    localStorage.setItem('branch_id', branchId);
                    localStorage.setItem('property_folder', propertyFolder);
                    localStorage.setItem('phone_no', phoneNumber);
                    console.log('successful:', response.data);
                    navigate('/Home')
                })
                .catch(function (error) {
                    console.error('error', error);
                    toast('Failed to verify',{
                        autoClose: 500,
                        hideProgressBar: true
                    })
                    
                });
        }
    };

    // "homepage": "https://mohammadaamir12.github.io/WebCamera",

    return (
        <div className="Auth-form-container">
        
            <form className="Auth-form" onSubmit={showOtp ? handleOtpSubmit : handleNumberSubmit}>
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Sign In</h3>
                    <div className="form-group mt-3">
                        <label>Enter Your Number</label>
                        <PhoneInput
                         country={'in'}
                            // className="form-control mt-1"
                            placeholder="Enter number"
                            value={number}
                            onChange={handleNumberChange}
                            inputProps={{
                                
                                required: true,
                               
                              }}
                              containerStyle={{
                                width: '100%',
                              }}
                              inputStyle={{
                                width: '100%',
                                height: '40px',
                                fontSize: '16px',
                                borderColor: '#ced4da',
                                borderRadius: '.25rem',
                                paddingLeft: '40px', // Adjust according to your layout
                              }}
                              buttonStyle={{
                                borderRadius: '.25rem 0 0 .25rem',
                                borderColor: '#ced4da',
                              }}
                             
                        />
                    </div>
                    {showOtp && (
                        <div className="form-group mt-3">
                            <label>OTP</label>
                            <input
                                type="text"
                                className="form-control mt-1"
                                placeholder="Enter otp here"
                                value={otp}
                                onChange={handleOtpChange}
                            />
                        </div>
                    )}
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary">
                            {showOtp ? 'Submit OTP' : 'Submit Number'}
                            {loading==true?<div className="loader">Loading...</div>:null}
                        </button>
                    </div>
                    {/* <p className="forgot-password text-right mt-2">
              Forgot <a href="#">password?</a>
          </p> */}
                </div>
            </form>
            <ToastContainer />
        </div>
    )
}
