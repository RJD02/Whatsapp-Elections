const express = require("express");
const {
  getHome,
  postHome,
  setLanguageGet,
  setLanguagePost,
} = require("../controller/webhook");
const router = express.Router();

router.get("/", getHome);

router.post("/", postHome);

router.get("/setlanguage", setLanguageGet);
router.post("/setlanguage", setLanguagePost);

module.exports = router;
