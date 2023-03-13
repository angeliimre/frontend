import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import nouser from "../img/nouser.jpg";
import Loading from "./loading.js";
import { Navigate, useNavigate } from "react-router-dom";


export default function Group({user,getUser}){
   
    const [users,setUsers]=useState([]);
    const [group_data,setGroup]=useState({});
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

    function letrehoz(){
      let members=[];
      let group_details={};
      document.querySelectorAll(".members").forEach(function(item){
        item.checked&&members.push(parseInt(item.id));
      })
      group_details.members=members;
      group_details.name=document.getElementById("csoport").value
      fetch("http://127.0.0.1:8001/api/realgroup",{
        method: "POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify(group_details)
      }).then(
        res=>res.json()
      ).then(
        res=>navigate(`/conversation`)
      )
      //console.log(group_details);
    }


    return user?<div className="row ">
    <div className="card-body m-0 row h-100 p-0">
      <div className="col-2 offset-5 border">
        {users.map(function(item,index){
            return <div className="row hoverable-row">
                <div className="profile-image-container" style={{width:"60px"}}>
                    <input type="checkbox" className="members" id={item.id}/>
                    
                </div>
                <div className="col col-autocalc py-2">{item.name}
                </div>
                
            </div>
        })
        
        }
        <div>
            <label htmlFor="csoport">Csoport neve:</label>
            <input type="text" id="csoport"/>
            <button onClick={function(){
              letrehoz();
            }}>Létrehoz</button>
        </div>
      </div>
    </div>
  </div>:<Loading/>
}