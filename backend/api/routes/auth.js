const router = require('express').Router()
const {handleLogin} = require('../controls/secondLevel/authController')

router.route('/')
  .post(handleLogin)

module.exports = router


