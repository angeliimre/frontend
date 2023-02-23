import logo from './logo.svg';
import './App.css';
import Register from './components/register';
import 'bootstrap/dist/css/bootstrap.css';
import {Routes,Route,Link,BrowserRouter} from "react-router-dom";
import Login from './components/login';
import Profile from './components/profile';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function App() {
  const [user,setUser]=useState(null)

  const getUser=()=>{
    fetch("http://127.0.0.1:8001/api/user",{
            headers:{
                'Content-Type':'application/json',
                'Authorization': 'Bearer '+Cookies.get("token")
            }
        }).then(
            res=>res.json()
        ).then(
            user=>{

                setUser(user)
            }
        )
  }
  useEffect(()=>{
    getUser()
  },[])

  return <BrowserRouter>
    <Routes>
      <Route index element={<Register user={user} getUser={getUser}/>}/>
      <Route path="/login" element={<Login user={user} getUser={getUser}/>}/>
      <Route path="/profile" element={<Profile user={user} getUser={getUser}/>}/>
    </Routes>
  </BrowserRouter>
}

export default App;
