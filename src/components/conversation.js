import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import nouser from "../img/nouser.jpg";
import Loading from "./loading.js";
import { useParams, useNavigate } from "react-router-dom";

var terminal;
export default function Conversation({user,getUser}){
   
    const [users,setUsers]=useState([]);
    const [messages,setMessages]=useState([]);
    const [sender,setSender]=useState({});
    const params=useParams();
    const partner_id=params.user_id
    const [partner,setPartner]=useState("");
    const [groups,setGroups]=useState({});
    const navigate = useNavigate();
    const [display,setDisplay]=useState("none");
    const [name,setName]=useState("");

    useEffect(()=>{
      user&&selectGroups(user.id)
      partner_id&&setDisplay("block")
      user&&partner_id&&partnerData(user.id,partner_id)
    },[user])

    useEffect(()=>{
      console.log("sender:")
      console.log(sender);
    },[sender])


    function partnerData(my_id,partner_id){
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
          //setSender({...sender,group_id:res.id,user_id:my_id})
          //setName(res.name)
          handleSelectConversation(res.id,res.name)
        }
      )
    }
      
    function handleSelectConversation(group_id,name){
      setDisplay("block");
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
              setSender({...sender,user_id:user.id,group_id:group_id})
              
            }
        )},3000)
        setName(name);
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
        handleSelectConversation(sender.group_id,name)
        document.getElementById("content").value="";
    }
    function selectGroups(my_id){
      setSender({...sender,user_id:my_id})
      
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

        console.log(groups)
    }

    return user?<div className="card m-2 h-100">
    <div className="card-header">
      Chat, belépve: {user.name}
      <button onClick={function(){
        navigate("/profile");
      }}>Új chat</button>
      <button onClick={function(){
        navigate("/group");
      }}>Új csoport</button>
      <div style={{display:"block"}}><div style={{paddingRight:"20px",display:"flex",justifyContent:"flex-end"}}><span style={{background:"red",fontSize:"large"}}>{name}</span></div></div>
    </div>
    <div className="card-body m-0 row p-0" style={{height:"90%"}}>
      <div className="col-4 border" style={{overflow:"scroll",height:"100%"}}>
        {groups.length&&groups.map(function(item,index){
            return <div className="row hoverable-row" onClick={function(){
              clearInterval(terminal);
              handleSelectConversation(item.group_id,item.name);
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
      <div className="col-8 border box" style={{height:"100%"}}>
        <div className="messages" style={{overflow:"scroll",width:"100%"}}>
          
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
        <div className="sender" style={{display:display}}>
          <input type="text" id="content" onChange={handleChange}/>
          <button onClick={handleSubmit}>Küldés</button>
        </div>
      </div>
    </div>
  </div>:<Loading/>
}