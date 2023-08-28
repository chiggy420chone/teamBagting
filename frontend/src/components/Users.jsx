import {useState,useEffect,useRef} from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import {useNavigate,useLocation} from 'react-router-dom'

const Users = () => {
  const [users,setUsers] = useState([])
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()

  const effectRun = useRef(false)	

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const getUsers = async () => {
      try{
        const response = await axiosPrivate.get('/users',{
          signal:controller.signal
	})
	console.log(response.data)
	isMounted && setUsers(response.data)
      }catch(err){
        console.error(err)
	navigate('/auth',{state:{from:location},replace:true})
      }
    }

    if(effectRun.current){
      getUsers()
    }
     
    console.log('Found Users:',users)

    return () => {
      isMounted:false
      controller.abort()
      effectRun.current = true
    }
  },[])

  return(
    <article> 
      <h2>Users List</h2>
      { users?.length
	  ? (
              <ul>
                { users.map((user,index) => {
                    return(
		      <li key={index}>
                        {user?.username}
		       </li>
		    )
		  })
		}
	      </ul>
	  ) : (<p>No users to display</p>)
      }
    </article>
  )
}

export default Users
