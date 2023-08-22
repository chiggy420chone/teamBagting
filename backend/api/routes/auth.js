const router = require('express').Router()
const {handleLogin} = require('../controls/firstLevel/authController')

router.route('/')
  .post(handleLogin)

module.exports = router


