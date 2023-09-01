import {useRef,useState,useEffect} from 'react'
import useAuth from '../hooks/useAuth'
import {Link,useNavigate,useLocation} from 'react-router-dom'
import useInput from '../hooks/useInput'
import useToggle from '../hooks/useToggle'
import axios from '../api/axios'

const LOGIN_URL = '/auth'

const Login = () => {
  const {setAuth} = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"

  const userRef = useRef()
  const errRef = useRef()

  const [username,resetUsername,usernameAttributeObj] = useInput('username','')
  const [password,setPassword] = useState('')
  const [errMsg,setErrMsg] = useState('')
  const [check,toggleCheck] = useToggle('persist',false)

  useEffect(() => {
    userRef.current.focus()
  },[])

  useEffect(() => {
    setErrMsg('')  
  },[username,password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      const response = await axios.post(LOGIN_URL,
        JSON.stringify({username,password}),{
          headers:{
             'Content-Type':'application/json'
	  },
          withCredentials:true
	}
      )
      console.log(JSON.stringify(response?.data))
      const accessToken = response?.data?.accessToken
      const roles = response?.data?.roles
      setAuth({username,password,accessToken,roles})
      resetUsername('')
      setPassword('')
      navigate(from,{replace:true})
    }catch(err){
      console.error(err)
      if(!err?.response){
        setErrMsg('No Server Response')
      }else if(err.response?.status === 400){
        setErrMsg("Missing Username Or Password")
      }else if(err.response?.status === 401){
        setErrMsg("Unauthorized")
      }else{
        setErrMsg("Login Failed")
      }
      errRef.current.focus()
    } 
  }

  {/*--	
  const togglePersist = () => {
    setPersist(prev => !prev)
  }	
  
  useEffect(() => {
    localStorage.setItem("persist",persist)
  },[persist])
  --*/}

  return(
        <section>
          <p
            ref={errRef}
	    className={
              errMsg ? "errmsg" : "offscreen" 
	    }
	    aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
	    <input 
              type="text"
	      id="username"
	      ref={userRef}
	      autoComplete="off"
	      {...usernameAttributeObj}
	      required
	    />

	    <label htmlFor="password">Password:</label>
	    <input 
              type="password"
	      id="password"
	      onChange={
                (e) => {
                  setPassword(e.target.value) 
	        }
	      }
	      value={password}
	      required
	    /> 
	    <button
              type="submit" 
	    >
              Sign In
	    </button>
	    <div className="persistCheck">
              <input 
                type="checkbox"
	        id="persist"
	        onChange={toggleCheck}
	        checked={check}
	      />
	      <label htmlFor="persist">Trust this Device</label>
	    </div>
	    <p>
              Need an account? <br />
	      <span
                className="line"
	      >
                <a href="#">Sign Up</a>
	      </span>
	    </p>
          </form>
        </section>
  )
}

export default Login
