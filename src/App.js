import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Auth from './screens/Auth';
import Home from './screens/Home';




function App() {

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
