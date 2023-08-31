const router = require('express').Router()
const {handleRefreshToken} = 
  require('../controls/secondLevel/refreshTokenController')

router.route('/')
  .get(handleRefreshToken)

module.exports = router
