import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom"
import Auth from './screens/Auth';
import Home from './screens/Home';
import { useCallback, useEffect, useRef, useState } from 'react';



function App() {
  const [isAuth, setIsAuth] = useState(false);
  return (
    <BrowserRouter>
    {isAuth?(
     <Routes>
     <Route path="/" element={<Auth />} />
     <Route path='/Home' element={isAuth?<Home setAuth={setIsAuth}/>:<Navigate to="/" />} />
   </Routes>
    ):(
      <Routes>
        <Route path="/" element={<Auth setAuth={setIsAuth} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    )}
     
    </BrowserRouter>


  );
}

export default App;
