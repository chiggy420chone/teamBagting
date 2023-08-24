const User = require('../../../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const handleLogin = async (req,res) => {
  const {user,password} = req.body
  
  if(!user || !password){
    return(
      res.status(400).json({
        "message":"Username and Password are required."
      })
    )
  }

  const foundUser = await User.findOne({username:user}).exec()

  if(!foundUser){
    return(
      res.sendStatus(401) //Unauthorized
    )
  }
  console.log('Found User:',foundUser)
  //Evaluate Password
  const match = await bcrypt.compare(password,foundUser.password)
  if(match){
    const roles = Object.values(foundUser.roles)
    //Create JWT's:
    const accessToken = jwt.sign({
      "UserInfo":{
        "username":foundUser.username,
	"roles":roles
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn:'120s'}
    )

    const refreshToken = jwt.sign({
      "username":foundUser.username,
      },process.env.REFRESH_TOKEN_SECRET,
      {expiresIn:'180s'}
    )
    //Saving refreshToken with current user
    foundUser.refreshToken = refreshToken
    const result = await foundUser.save()

    console.log(result)	  

    res.cookie('jwt',refreshToken,{
      httpOnly:true,
      sameSite:'None',
      secure:true,
      maxAge: 1000 * 60 * 3 * 1
    })	   
    res.status(200).json({
      "message":`User ${user} is logged in.`,
      roles,
      accessToken,
      refreshToken,
    })
  }else{
    res.sendStatus(401)
  }
}
 

module.exports = {handleLogin}
