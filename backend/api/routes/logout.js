const router = require('express').Router()
const {handleLogout} = require('../controls/secondLevel/logoutController')

router.route('/')
  .get(handleLogout)

module.exports = router
