const router = require('express').Router()
const dashboard = require('../controls/secondLevel/dashboardController')

router.route('/')
  .get(dashboard)

module.exports = router
