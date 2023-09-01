const User = require('../../../models/user')

const handleLogout = async (req,res) => {
  const cookies = req.cookies
  console.log('Cookies:',cookies)
  if(!cookies?.jwt){
    return(
      res.sendStatus(204) //No Content
    )
  }
  console.log('Cookies JWT:',cookies.jwt)
  const refreshToken = cookies.jwt

  //Is refreshToken In DB	
  const foundUser = await User.findOne({refreshToken}).exec()
  if(!foundUser){
    res.clearCookie('jwt',{
      httpOnly:true,
      sameSite:'None',
      secure:true,
      maxAge:1000 * 60 * 3 * 1
    })
    return(
      res.sendStatus(204)
    )
  }

  //Delete refreshToken In DB
  foundUser.refreshToken = 
  foundUser.refreshToken.filter(rt => rt !== refreshToken)
  const result = await foundUser.save()

  console.log(result)

  res.clearCookie('jwt',{
    httpOnly:true,
    sameSite:'None',
    secure:true,
  })
  res.sendStatus(204)
}

module.exports = {handleLogout}

