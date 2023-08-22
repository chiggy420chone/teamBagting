const usersDB = {
  users:require('../../models/users.json'),
  setUsers:function(data){
    this.data = data
  }
}
const fsPromises = require('fs').promises
const path = require('path')
const bcrypt = require('bcryptjs')

const handleNewUser = async (req,res) => {
  const {user,password} = req.body
  if(!user || !password){
    return(
      res.status(400).json({
        "message":"Username & Password are required."
      })
    ) 
  }
  //Check For Duplicate Username In the DB
  const duplicate = usersDB.users.find(
	  person => person.username === user)
  
  console.log('Duplicate Account',duplicate)
  if(duplicate){
    return(
      res.sendStatus(409) //Conflict
    )
  }

  try{
    //Encrypt The Password
    const hashedPassword = await bcrypt.hash(password,10)
    //Store The New User
    const newUser = {
      "username":user,
      "password":hashedPassword
    }
    usersDB.setUser([...usersDB.users,newUser])
    await fsPromises.writeFile(
      path.join(__dirname,'../../','models','users.json'),
      JSON.stringify(usersDB.users)
    )
    //await usersDB.setUser([...usersDB.users,newUser])
    
    console.log('Location Directory:',path.join(__dirname))
    console.log('Target File:',path.join(__dirname,'../../','models','users.json'))
    res.status(201).json({
      "success":`New User ${user} Created!`,
      "data":usersDB.users
    })
  }catch(err){
    console.log(err.message)
    res.status(500).json({
      "message":err.message
    })
  }
}

module.exports = {handleNewUser}
