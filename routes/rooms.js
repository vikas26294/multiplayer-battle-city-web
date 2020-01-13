var express = require("express")
var router = express.Router()

/* GET room page. */
router.get("/", function(req, res, next) {
  res.render("index", { page: "rooms", title: "Rooms" })
})

module.exports = router
