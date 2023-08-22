const router = require('express').Router()
const {handleLogout} = require('../controls/firstLevel/logoutController')

router.route('/')
  .get(handleLogout)

module.exports = router
