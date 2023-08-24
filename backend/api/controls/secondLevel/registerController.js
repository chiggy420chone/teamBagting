const User = require('../../../models/user')
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
  const duplicate = await User.findOne({username:user}).exec()
  if(duplicate){
    return(
      res.sendStatus(409) //Conflict
    )
  }
  try{
    //Encrypt The Password
    const hashedPassword = await bcrypt.hash(password,10)
    //Store The User
    const result = await User.create({
      "username":user,
      "password":hashedPassword,
    })
    console.log(result)	  
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
