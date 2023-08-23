let usersDB = {
  users:require('../../../models/usersFile.json'),
  setUsers: function(data){
    this.users = data
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
        "message":"Username and Password are required."
      })
    )
  }
  //Check For Duplicate Username In The UsersFile
  const duplicate = usersDB.users.find(person => person.username === user)
  if(duplicate){
    return(
      res.sendStatus(409) //Conflict
    )
  }
  try{
    //Encrypt The Password
    const hashedPassword = await bcrypt.hash(password,10)
    //Store The User
    const newUser = {
      "username":user,
      "password":hashedPassword,
      "roles":{
        "User":2001
      }
    }
    //Create Another Mutatable Array
    usersDB.setUsers([...usersDB.users,newUser])
    
    await fsPromises.writeFile(
      path.join(
        __dirname,'../../../','models','usersFile.json'
      ),
      JSON.stringify(usersDB.users)
    )
    console.log('Location Directory:',path.join(__dirname))
    console.log('Target File:',
      path.join(__dirname,'../../../','models','usersFile.json'))    
    console.log(usersDB.users)
    res.status(201).json({
      "success":true,
      "message":`New User ${user} Created!`
    })
  }catch(err){
    res.status(500).json({
      "message":err.message
    })
  }
}


module.exports = {handleNewUser}
