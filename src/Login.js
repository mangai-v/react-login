import React, { useContext } from 'react'
import {useRef,useState,useEffect} from 'react'
import AuthContext from './context/AuthProvider'
import axios from './api/axios';
const LOGIN_URL = '/auth';
const Login = () => {
    const userRef = useRef()
    const errRef = useRef()
    const {setAuth} = useContext(AuthContext)
   
    const [user,setUser] = useState('')
    const [pwd,setPwd] = useState('')
    const [errMsg,setErrMsg] = useState('')
    const [success,setSuccess] = useState(false)
    
    useEffect(()=>{
        userRef.current.focus()
    },[])

    useEffect(()=>{
        setErrMsg('')
    },[user,pwd])

    const handleSubmit = async(e)=>{
        e.preventDefault()
        try{
            const response =await axios.post(LOGIN_URL,JSON.stringify({user,pwd}),{
                headers:{
                    "Content-Type":'application/json',
                    "withCredentials":true
                }
            })
            console.log(response?.data);
            const accessToken = response?.data?.accessToken
            setAuth({user,pwd,accessToken})
            setUser('')
            setPwd('')
            setSuccess(true)
        } catch (err){
            if(!err?.response){
                setErrMsg('No server response')
            } else if(err.response?.status===400){
                setErrMsg('Missing username or password')
            } else if(err.response?.status===401){
                setErrMsg('Unauthorized')
            } else {
                setErrMsg('Login Failed')
            }
        }
       
    }
  return (
    <>{success?(
        <section>
            <h1>You are logged In!</h1><br/>
            <p>
                <a href='#'>Go to Home</a>
            </p>
        </section>
    ):(<section>
        <p className={errMsg?"errmsg":"offscreen"} aria-live='assertive'>{errMsg}</p>
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor='username'>Username:</label>
            <input
                type='text'
                id='username'
                ref={userRef}
                value={user}
                onChange={(e)=>setUser(e.target.value)}
                required
                autoComplete='off'
            />
            <label htmlFor='password'>Password:</label>
            <input
                type='password'
                id='password'
                value={pwd}
                onChange={(e)=>setPwd(e.target.value)}
                required
            />
            <button>Sign In</button>
        </form>
        <p>
            Need an account?<br />
            <span className='line'>
                <a href='#'>Sign Up</a>
            </span>
        </p>
    </section>
    )}
    </>
  )
}

export default Login