const User = require('../../../models/user')
const jwt = require('jsonwebtoken')

const handleRefreshToken = async (req,res) => {
  const cookies = req.cookies
  if(!cookies?.jwt){
    return(
      res.sendStatus(401) //Unauthorized
    )
  }
  console.log('Cookie JWT:',cookies.jwt)
  const refreshToken = cookies.jwt
  res.clearCookie('jwt',{
    httpOnly:true,
    sameSite:'None',
    secure:true
  })

  const foundUser = await User.findOne({refreshToken}).exec()
  
  //Detected Refresh Token Reuse
  if(!foundUser){
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err,decoded) => {
        if(err){
          res.sendStatus(403) //Forbidden
	}
	console.log('attempted refresh token reuse!')
	const hackedUser = await User.findOne({username:decoded.username}).exec()
	hackedUser.refreshToken = []
	const result = await hackedUser.save()
        console.log(result) 
      }
    )
    return(
      res.sendStatus(403) //Forbidden
    )
  }

  const newRefreshTokenArray = 
  foundUser.refreshToken.filter(rt => rt !== refreshToken)

  //Evaluate JWT
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err,decoded) => {
      if(err){
	console.log('expired refresh token')
        foundUser.refreshToken = [...newRefreshTokenArray]
        const result = await foundUser.save()
	console.log(result)
      }
      if(err || foundUser.username !== decoded.username){
        return(
          res.sendStatus(403) //Forbidden
	)
      }
      console.log('Decoded Username:',decoded.username)

      //refreshToken was still valid	    
      const roles = Object.values(foundUser.roles)
      const accessToken = jwt.sign({
        "UserInfo":{
          "username":decoded.username,
          "roles":roles
	  },
        },  	
	process.env.ACCESS_TOKEN_SECRET,
	{expiresIn:'30s'}
      )

      const newRefreshToken = jwt.sign({
        "username":foundUser.username
        },
        process.env.REFRESH_TOKEN_SECRET,
	{expiresIn:'120s'}
      )
      //Saving refreshToken with current user
      foundUser.refreshToken = [...newRefreshTokenArray,newRefreshToken]
      const result = await foundUser.save()

      //Creates Secure Cookie With Refresh Token
      res.cookie('jwt',newRefreshToken,{
        httpOnly:true,
	secure:true,
	sameSite:'None',
	maxAge: 1000 * 60 * 60 * 24
      })
      res.json({
	username:foundUser.username,
        accessToken,
	roles
      })
    }
  )
}

module.exports = {handleRefreshToken}
