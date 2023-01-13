const express = require("express");
const { getHome, postHome } = require("../controller/webhook");
const router = express.Router();

router.get("/", getHome);

router.post("/", postHome);

module.exports = router;
