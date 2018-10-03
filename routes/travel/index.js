const express = require("express");
const router = express.Router();

router.get("/travel", function (req, res) {
    res.render("travel/index")
});

module.exports = router;