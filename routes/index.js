const express = require("express");
const router = express.Router();
const { homePage, homePageWithUrlData, redirectUrl, listAllUrls, detailsUrl, statsUrl } = require("../controllers");

router.get("/", homePage);
router.post("/", homePageWithUrlData);
router.get('/urls', listAllUrls);
router.get("/:shortCode", redirectUrl);
router.get("/details/:shortCode", detailsUrl);
router.get("/stats/:shortCode", statsUrl);

module.exports = router;