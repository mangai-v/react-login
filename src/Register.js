import React from 'react'
import { useState,useRef,useEffect } from 'react'
import { faCheck,faTimes,faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from './api/axios'
const Register = () => {
    const userRef = useRef()
    const errRef = useRef()
    const REGISTER_URL = '/register'
    const[user,setUser] = useState('')
    const[validName,setValidName] = useState(false)
    const[userFocus,setUserFocus] = useState(false)

    const[pwd,setPwd] = useState('')
    const[validPwd,setValidPwd] = useState(false)
    const[pwdFocus,setPwdFocus] = useState(false)

    const[matchPwd,setMatchPwd] = useState('')
    const[validMatch,setValidMatch] = useState(false)
    const[matchFocus,setMatchFocus] = useState(false)

    const [errMsg,setErrMsg] = useState('')
    const[success,setSuccess] = useState(false)

    const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

    useEffect(()=>{
        userRef.current.focus()
    },[])
    useEffect(()=>{
        const result = USER_REGEX.test(user)
        setValidName(result)
    },[user])
    useEffect(()=>{
        const result = PWD_REGEX.test(pwd)
        setValidPwd(result)
        const match = pwd===matchPwd
        setValidMatch(match)
    },[pwd,matchPwd])
    useEffect(()=>{
        setErrMsg('')
    },[user,pwd,matchPwd])
    
    const handleSubmit = async(e)=>{
        e.preventDefault()
        try {
            const response = await axios.post(REGISTER_URL,JSON.stringify({user,pwd}),{
                headers:'application/json',
                withCredentials:true
            })
            console.log(response?.data);
            setSuccess(true)
        } catch(err){
            if(!err?.response){
                setErrMsg('No Server Response');
            } else if (err.response?.status===409){
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus()
       }
    }
  return (
    <>
    {success?(
        <section>
            <h1>Success!</h1>
            <p>
                <a href='#'>Sign in</a>
            </p>
        </section>
    ):(
    <section>
        <p className={errMsg?"errmsg":"offscreen"} aria-live='assertive'>{errMsg}</p>
        <form onSubmit={handleSubmit}>
        <label htmlFor='username'>Username :
            <FontAwesomeIcon icon={faCheck} className={validName?"valid":"hide"}/>
            <FontAwesomeIcon icon={faTimes} className={validName || !user?"hide":"invalid"}/>
        </label>
        <input 
            type='text'
            ref={userRef}
            id='username'
            required
            autoComplete='off'
            aria-invalid={validName?"false":"true"}
            aria-describedby='uidnote'
            onChange={(e)=>setUser(e.target.value)}
            onFocus={()=>setUserFocus(true)}
            onBlur={()=>setUserFocus(false)}
        />
        <p className={userFocus&&user&&!validName?"instructions":"offscreen"} id='uidnote'>
            <FontAwesomeIcon icon={faInfoCircle} />
            4 to 24 characters.<br />
            Must begin with a letter.<br />
            Letters, numbers, underscores, hyphens allowed.
        </p>

        <label htmlFor='password'>Password :
            <FontAwesomeIcon icon={faCheck} className={validPwd?"valid":"hide"}/>
            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd?"hide":"invalid"}/>
        </label>
        <input 
            type='password'
            value={pwd}
            id='password'
            required
            autoComplete='off'
            aria-invalid={validName?"false":"true"}
            aria-describedby='pwdnote'
            onChange={(e)=>setPwd(e.target.value)}
            onFocus={()=>setPwdFocus(true)}
            onBlur={()=>setPwdFocus(false)}
        />
        <p className={pwdFocus&&!validPwd?"instructions":"offscreen"} id='pwdnote'>
            <FontAwesomeIcon icon={faInfoCircle} />
            8 to 24 characters.<br />
            Must include uppercase and lowercase letters, a number and a special character.<br />
            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
        </p>

        <label htmlFor='confirm_pwd'>Confirm Password :
            <FontAwesomeIcon icon={faCheck} className={validMatch&&matchPwd?"valid":"hide"}/>
            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd?"hide":"invalid"}/>
        </label>
        <input 
            type='password'
            value={matchPwd}
            id='confirm_pwd'
            required
            autoComplete='off'
            aria-invalid={validName?"false":"true"}
            aria-describedby='confirmnote'
            onChange={(e)=>setMatchPwd(e.target.value)}
            onFocus={()=>setMatchFocus(true)}
            onBlur={()=>setMatchFocus(false)}
        />
        <p className={matchFocus&&!validMatch?"instructions":"offscreen"} id='confirmnote'>
            <FontAwesomeIcon icon={faInfoCircle} />
            Must match the first password input field.
        </p>
        <button disabled={!validName||!validPwd||!validMatch?true:false}>Sign Up</button>
        </form>
        <p>
            Already registered?<br />
            <span className="line">
                {/*put router link here*/}
                <a href="#">Sign In</a>
            </span>
        </p>
    </section>
    )}
    </>
  )
}

export default Register