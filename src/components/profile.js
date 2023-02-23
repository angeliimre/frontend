import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import nouser from "../img/nouser.jpg";
import Loading from "./loading.js";


export default function Profile({user,getUser}){
   
    const [users,setUsers]=useState([]);
    const [messages,setMessages]=useState([]);
    const [sender,setSender]=useState({});
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

      let terminal;
    function handleSelectConversation(my_id,partner_id){
      
      //terminal=setInterval(,3000)
     if(typeof(terminal)!=='undefined'){
      clearTimeout(terminal);
     }
      fetch(`http://127.0.0.1:8001/api/loadconversation/${my_id}/${partner_id}`,{
            method: "GET",
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer "+Cookies.get("token")
            }
        }).then(
            result=>result.json()
        ).then(
            result => {
              console.log(result)
              setMessages(result)
              setSender({...sender,group_id:result[result.length-1]})
              
            }
        ).finally(function(){
          terminal=setTimeout(()=>{
            handleSelectConversation(my_id,partner_id)
          },3000)
        })
    }
    function handleChange(e){
      setSender({...sender,[e.target.id]:e.target.value,user_id:user.id})
    }
    function handleSubmit(e){
      
      e.preventDefault()
      
      fetch("http://127.0.0.1:8001/api/sender",{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(sender)
        }).then(
          result=>result.json()
        ).then(
          result=>console.log(result)
        )
    }

    return user?<div className="card m-2 h-100">
    <div className="card-header">
      Chat, belépve: {user.name}
    </div>
    <div className="card-body m-0 row h-100 p-0">
      <div className="col-4 border">
        {users.map(function(item,index){
            return <div className="row hoverable-row" onClick={function(){
              handleSelectConversation(user.id,item.id);
              
            }}>
                <div className="profile-image-container" style={{width:"60px"}}>
                    <img className="rounded-circle" src={nouser} width="50px" height="50px"/>
                </div>
                <div className="col col-autocalc py-2">{item.name}
                  <div className="text-truncate post-text-preview">
                    Ez egy teszt üzenet tartalma betekintésre...
                  </div>
                </div>
            </div>
        })
        
        }
      </div>
      <div className="col-8 border box">
        <div className="messages">
        {
          messages.map(function(item,index){
            if(item.user_id==user.id){
              return <div style={{color:"red"}}>{item.content}</div>
            }else{
              return <div style={{color:"blue"}}>{item.content}</div>
            }
          })
        }
        </div>
        <div className="sender">
          <input type="text" id="content" onChange={handleChange}/>
          <button onClick={handleSubmit}>Küldés</button>
        </div>
      </div>
    </div>
  </div>:<Loading/>
}