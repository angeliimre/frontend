import {useState} from "react"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie"

function Error(props){
    return <>{props.response[props.field]&&<div className="text-danger">{props.response[props.field]}</div>}</>
}


export default function Register({user,getUser}){
    const initialResponseState={name:'',email:'',password:'',status:null};
    const initialDataState={name:'',email:'',password:'',password_confirmation:''};
    
    const [response,setResponse]=useState(initialResponseState)

    const [data,setData]=useState(initialDataState)
    const hadleChange=(e)=>{
        setData({...data,[e.target.id]:e.target.value})
    }
    const navigate = useNavigate();
    const handleSubmit=(e)=>{
        e.preventDefault();
        fetch("http://127.0.0.1:8001/api/register",{
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
        <h2 className="col-12 text-center">Regisztráció</h2>
        <div className="col-md-8 col-lg-4 col-xl-3">
            <label htmlFor="name" className="form-label">Név</label>
            <input type="text" id="name" className="form-control mb-2" onChange={hadleChange} value={data.name}/>
            <Error response={response} field="name"/>
            <label htmlFor="email" className="form-label">E-mail</label>
            <input type="text" id="email" className="form-control mb-2" onChange={hadleChange} value={data.email}/>
            <Error response={response} field="email"/>
            <label htmlFor="password" className="form-label">Jelszó</label>
            <input type="password" id="password" className="form-control mb-2" onChange={hadleChange} value={data.password}/>
            <Error response={response} field="password"/>
            <label htmlFor="password_confirmation" className="form-label">Jelszó megerősítés</label>
            <input type="password" id="password_confirmation" className="form-control mb-2" onChange={hadleChange} value={data.password_confirmation}/>
            <button className="btn btn-success">Küldés</button>
        </div>
    </form>

}