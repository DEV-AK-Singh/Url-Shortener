const Url = require("../models/Url");
const Analytics = require("../models/Analytics");
const shortid = require("shortid");

exports.shortenUrl = async (req, res) => {
  const { longUrl } = req.body;
  const shortCode = shortid.generate();
  console.log(longUrl);
  if (!longUrl) {
    res.render("pages/home", {
      title: "Home - URL Shortener",
      data: "Please enter a valid URL",
      layout: "./layouts/main",
    });
  } else {
    try {
      const url = await Url.create({ longUrl, shortCode });
      const acceptHeader = req.headers.accept;
      if (acceptHeader.includes("application/json")) {
        res.json(url);
      } else if (acceptHeader.includes("text/html")) {
        res.render("pages/home", {
          title: "Home - URL Shortener",
          data: url,
          layout: "./layouts/main",
        });
      } else {
        res.render("pages/home", {
          title: "Home - URL Shortener",
          data: url,
          layout: "./layouts/main",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to shorten URL" });
    }
  }
};

exports.listAllUrls = async (req, res) => {
  try {
    const urls = await Url.find();
    res.json(urls);
  } catch (error) {
    res.status(500).json({ error: "Failed to get URLs" });
  }
};

exports.redirectUrl = async (req, res) => {
  const { shortCode } = req.params;
  try {
    const url = await Url.findOne({ shortCode });
    if (url) {
      await Analytics.create({
        shortCode,
        ip: req.ip,
        referrer: req.headers["user-agent"],
        browser: req.headers["user-agent"],
        platform: req.headers["user-agent"],
      });
      res.redirect(url.longUrl);
    } else {
      res.status(404).json({ error: "URL not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to redirect" });
  }
};

exports.analyticsUrl = async (req, res) => {
  const { shortCode } = req.params;
  try {
    const analytics = await Analytics.find({ shortCode });
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: "Failed to get analytics" });
  }
};
