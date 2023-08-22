const router = require('express').Router()
const {handleRefreshToken} = 
  require('../controls/firstLevel/refreshTokenController')

router.route('/')
  .get(handleRefreshToken)

module.exports = router
