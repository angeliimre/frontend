import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import nouser from "../img/nouser.jpg";
import Loading from "./loading.js";
import { Navigate, useNavigate } from "react-router-dom";


export default function Profile({user,getUser}){
   
    const [users,setUsers]=useState([]);
    const [messages,setMessages]=useState([]);
    const [sender,setSender]=useState({});
    const navigate=useNavigate()
    useEffect(()=>{
      
        getUser()
        
        fetch("http://127.0.0.1:8001/api/users",{
            method: "GET",
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer "+Cookies.get("token")
            }
        }).then(
            result=>result.json()
        ).then(
            result => {
                setUsers(result)
            }
        )
        //user&&setSender({...sender,user_id:user.id})
      },[])

    function handleSelectProfile(my_id,partner_id){
      
      //terminal=setInterval(,3000)
      fetch(`http://127.0.0.1:8001/api/makegroup/${my_id}/${partner_id}`,{
            method: "GET",
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer "+Cookies.get("token")
            }
        }).then(
          res=>res.json()
        ).then(
          res=>{
            navigate(`/conversation/${partner_id}`)
          }
        )
        
        
    }

    return user?<div className="row ">
    <div className="card-body m-0 row h-100 p-0">
      <div className="col-2 offset-5 border">
        {users.map(function(item,index){
            return <div className="row hoverable-row" onClick={function(){
              handleSelectProfile(user.id,item.id);
              
            }}>
                <div className="profile-image-container" style={{width:"60px"}}>
                    <img className="rounded-circle" src={nouser} width="50px" height="50px"/>
                </div>
                <div className="col col-autocalc py-2">{item.id},{item.name}
                </div>
            </div>
        })
        
        }
      </div>
    </div>
  </div>:<Loading/>
}