const express = require("express");
const router = express.Router();
const { shortenUrl, redirectUrl, analyticsUrl, listAllUrls } = require("../controllers/api");

router.post("/shortenUrl", shortenUrl);
router.get("/listAllUrls", listAllUrls);
router.get("/redirectUrl/:shortCode", redirectUrl);
router.get("/analyticsUrl/:shortCode", analyticsUrl);

module.exports = router;