import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import nouser from "../img/nouser.jpg";
import Loading from "./loading.js";
import { useParams } from "react-router-dom";

var terminal;
export default function Conversation({user,getUser}){
   
    const [users,setUsers]=useState([]);
    const [messages,setMessages]=useState([]);
    const [sender,setSender]=useState({});
    const params=useParams();
    const partner_id=params.user_id
    const [partner,setPartner]=useState("");
    const [groups,setGroups]=useState({});

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

      
    function handleSelectConversation(group_id){
      
      terminal=setInterval(function(){
      fetch(`http://127.0.0.1:8001/api/loadconversation/${group_id}`,{
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
              setSender({...sender,group_id:group_id})
              
            }
        )},3000)
    }
    function handleChange(e){
      
      setSender({...sender,[e.target.id]:e.target.value})
      clearInterval(terminal);
      console.log(sender.group_id)
    }
    function handleSubmit(e){
      
      e.preventDefault()
      //clearInterval(terminal)
        fetch("http://127.0.0.1:8001/api/sender",{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(sender)
        })
        console.log(sender)
        handleSelectConversation(sender.group_id)
    }
    function selectGroups(my_id){
      setSender({...sender,user_id:my_id})
      setInterval(() => {
        fetch(`http://127.0.0.1:8001/api/conversation/${my_id}`,{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            }
        }).then(
          result=>result.json()
        ).then(
          result=>setGroups(result)
        );
      },2000)
        console.log(groups)
    }

    return user?<div className="card m-2 h-100">
    <div className="card-header">
      Chat, belépve: {user.name}
      <button onClick={function(){
        selectGroups(user.id)
      }}>Chatek betöltése</button>
    </div>
    <div className="card-body m-0 row h-100 p-0">
      <div className="col-4 border">
        {groups.length&&groups.map(function(item,index){
            return <div className="row hoverable-row" onClick={function(){
              clearInterval(terminal);
              handleSelectConversation(item.group_id);
              //handleSelectConversation(item.group_id)
            }}>
                <div className="profile-image-container" style={{width:"60px"}}>
                    <img className="rounded-circle" src={nouser} width="50px" height="50px"/>
                </div>
                <div className="col col-autocalc py-2">{item.name}
                  <div className="text-truncate post-text-preview">
                    {item.who}: {item.message}
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