const User = require('../../../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const handleLogin = async (req,res) => {
  const cookies = req.cookies
  console.log(`cookie available at login:${JSON.stringify(cookies)}`)
  
  const {username,password} = req.body
  
  if(!username || !password){
    return(
      res.status(400).json({
        "message":"Username and Password are required."
      })
    )
  }

  const foundUser = await User.findOne({username:username}).exec()

  if(!foundUser){
    return(
      res.sendStatus(401) //Unauthorized
    )
  }
  console.log('Found Username:',foundUser.username)
  //Evaluate Password
  const match = await bcrypt.compare(password,foundUser.password)
  if(match){
    const roles = Object.values(foundUser.roles).filter(Boolean)
    //Create JWT's:
    const accessToken = jwt.sign({
      "UserInfo":{
        "username":foundUser.username,
	"roles":roles
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn:'30s'}
    )

    const newRefreshToken = jwt.sign({
      "username":foundUser.username,
      },process.env.REFRESH_TOKEN_SECRET,
      {expiresIn:'120s'}
    )

    let newRefreshTokenArray = 
      !cookies?.jwt
        ? foundUser.refreshToken
	: foundUser.refreshToken.filter(rt => rt !== cookies.jwt )

    if(cookies?.jwt){
      //Reuse Detection Is Needed To Cler RT's When User Logs
      const refreshToken = cookies.jwt
      const foundToken = await User.findOne({refreshToken}).exec()

      //Detected Refresh Token Reise
      if(!foundToken){
        console.log('attempted refresh token reuse at login!')
	//clear out all previous refresh tokens
	newRefreshTokenArray = []
      }

      res.clearCookie('jwt',{
         httpOnly:true,
	secure:true,
	sameSite:'None'
      })
    }
    //Saving refreshToken with current user
    foundUser.refreshToken = [...newRefreshTokenArray,newRefreshToken]
    const result = await foundUser.save()

    console.log('Result: ',result) 
    console.log('Roles:',roles)

    res.cookie('jwt',newRefreshToken,{
      httpOnly:true,
      sameSite:'None',
      secure:true,
      maxAge: 1000 * 60 * 60 * 24
    })	   
    //
    res.status(200).json({
      "message":`User ${username} is logged in.`,
      roles,
      accessToken,
      username:foundUser.username
    })
  }else{
    res.sendStatus(401)
  }
}
 

module.exports = {handleLogin}
