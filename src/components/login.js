import {useState} from "react"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie"

function Error(props){
    return <div className="alert alert-danger">{props.children}</div>
}

export default function Login({user,getUser}){
    const initialResponseState={email:'',password:'',status:null};
    const initialDataState={email:'',password:''};
    
    const [response,setResponse]=useState(initialResponseState)

    const [data,setData]=useState(initialDataState)

    const hadleChange=(e)=>{
        setData({...data,[e.target.id]:e.target.value})
    }
    const navigate=useNavigate()
    const handleSubmit=(e)=>{
        e.preventDefault();
        fetch("http://127.0.0.1:8001/api/login",{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(data)
        })
        .then(
            res=>res.json()
        )
        .then(
            res=>{
                console.log(res)
                setResponse(res)
                if(res.status==="success"){
                    Cookies.set("token",res.token)
                    navigate("/profile")
                }
            }
        )
    }
    useEffect(()=>{
        getUser()
      },[])
    return <form onSubmit={handleSubmit} className="row justify-content-center p-2 mt-5 pt-5">
        
        <div className="col-md-8 col-lg-4 col-xl-3">
            {response.status==='error'&&<Error>Hibás belépési adatok</Error>}
            <h2 className="col-12 text-center">Belépés</h2>
            <label htmlFor="email" className="form-label">E-mail</label>
            <input type="text" id="email" className="form-control mb-2" onChange={hadleChange} value={data.email}/>
          
            <label htmlFor="password" className="form-label">Jelszó</label>
            <input type="password" id="password" className="form-control mb-2" onChange={hadleChange} value={data.password}/>
           
            <button className="btn btn-success">Küldés</button>
        </div>
    </form>

}