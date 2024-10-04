const shortid = require("shortid");
const Url = require("../models/Url");
const Analytics = require("../models/Analytics");

exports.homePage = (req, res) => {
  res.render("pages/home", {
    title: "Home - URL Shortener",
    data: null,
    layout: "./layouts/main",
  });
};

exports.homePageWithUrlData = async (req, res) => {
    const { longUrl } = req.body;
    const shortCode = shortid.generate();
    if (!longUrl) {
        res.render("pages/home", {
            title: "Home - URL Shortener",
            data: "Please enter a valid URL",
            layout: "./layouts/main",
        });
    } else {
        const availableUrl = await Url.findOne({ longUrl });
        if (availableUrl && availableUrl.expiresAt > Date.now()) {
            res.render("pages/home", {
                title: "Home - URL Shortener",
                data: availableUrl,
                layout: "./layouts/main",
            });
        } else {
            try {
                const url = await Url.create({ longUrl, shortCode });
                res.render("pages/home", {
                    title: "Home - URL Shortener",
                    data: url,
                    layout: "./layouts/main",
                });
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: "Failed to shorten URL" });
            }
        };
    };
};

exports.listAllUrls = async (req, res) => {
    try {
        const urls = await Url.find();
        res.render("pages/urls", { title: "All URLs", urls: urls, layout: "./layouts/main" });
    } catch (error) {
        console.error(error);
        res.render("pages/error", { title: "Error", message: "Failed to get URLs" });
    }
};

exports.redirectUrl = async (req, res) => {
    const { shortCode } = req.params;
    try {
        const url = await Url.findOne({ shortCode });
        if (url) {
            await Url.updateOne({ _id: url._id }, { $inc: { clicks: 1 } });
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
        console.error(error);
        res.status(500).json({ error: "Failed to redirect" });
    }
}

exports.detailsUrl = async (req, res) => {
    try {
        const url = await Url.findOne({ shortCode: req.params.shortCode });
        if (!url) {
            return res.status(404).render('pages/error', {
                title: 'URL Not Found',
                message: 'The URL you are trying to access does not exist.'
            });
        }
        res.render('pages/urlDetail', { url, title: 'URL Details', layout: "./layouts/main" });
    } catch (err) {
        console.error(err);
        res.status(500).render('pages/error', {
            title: 'Server Error',
            message: 'Something went wrong while fetching the details.'
        });
    }
};

exports.statsUrl = async (req, res) => {
    try {
        const url = await Url.findOne({ shortCode: req.params.shortCode });
        const analytics = await Analytics.find({ shortCode: req.params.shortCode });
        if (!url) {
            return res.status(404).render('pages/error', {
                title: 'URL Not Found',
                message: 'The URL you are trying to access does not exist.'
            });
        }
        const clicks = analytics || []; // Adjust based on your model structure
        res.render('pages/stats', { url, clicks, title: 'URL Statistics', layout: "./layouts/main" });
    } catch (err) {
        console.error(err);
        res.status(500).render('pages/error', {
            title: 'Server Error',
            message: 'Something went wrong while fetching the statistics.'
        });
    }
};