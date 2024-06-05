import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom"
import Auth from './screens/Auth';
import Home from './screens/Home';
import { useCallback, useEffect, useRef, useState } from 'react';



function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     setIsAuth(true);
  //   }
  // },[])
  
  return (
    <BrowserRouter>
   
     <Routes>
     <Route path="/" element={<Auth />} />
     <Route path='/Home' element={<Home />} />
   </Routes>
   
     
    </BrowserRouter>


  );
}

export default App;
