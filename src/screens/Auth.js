
import '../App.css'
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

export default function Auth() {
    const [number, setNumber] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('')

    const handleNumberChange = (e) => {
        setNumber(e.target.value);

    };
    const handleOtpChange = (e) => {
        setOtp(e.target.value)
    }


    const handleNumberSubmit = (e) => {
        e.preventDefault();
        if (number != '') {
            axios.post('https://4wex2d2cz0.execute-api.ap-south-1.amazonaws.com/default/lambda-staff-login', {
                phone_number: number,
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(function (response) {
                    toast('Success')
                    console.log('successful:', response.data);
                })
                .catch(function (error) {
                    console.error('error', error);
                    toast('Not')
                });
        }
        console.log('Number submitted:', number);
        // Assuming an API call here to send the number and receive an OTP
        setShowOtp(true);
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        if (otp != '') {
            axios.post('https://218j49ra6l.execute-api.ap-south-1.amazonaws.com/default/lambda-staff-login-validate', {
                phone_number: otp,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    toast('Success')
                    console.log('successful:', response.data);
                })
                .catch(function (error) {
                    console.error('error', error);
                    toast('Not')
                });
        }
    };


    return (
        <div className="Auth-form-container">
            <form className="Auth-form" onSubmit={showOtp ? handleOtpSubmit : handleNumberSubmit}>
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Sign In</h3>
                    <div className="form-group mt-3">
                        <label>Enter Your Number</label>
                        <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="Enter number"
                            value={number}
                            onChange={handleNumberChange}
                        />
                    </div>
                    {showOtp && (
                        <div className="form-group mt-3">
                            <label>OTP</label>
                            <input
                                type="password"
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
