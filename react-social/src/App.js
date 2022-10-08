import {
  
  Routes,
  Route
} from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Profile from "./pages/profile/Profile";





function App() {
  return (
    
      <Routes>
        <Route  path="/" element={<Home/>}/>
          
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/profile/:username" element={<Profile/>}/>
      </Routes>
    
  )
    
}

export default App;
