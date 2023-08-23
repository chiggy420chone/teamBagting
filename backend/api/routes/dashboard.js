const router = require('express').Router()
const dashboard = require('../controls/firstLevel/dashboardController')

router.route('/')
  .get(dashboard)

module.exports = router
