const { Router } = require("express");
const { SiteMap, StaticSiteMap } = require("../controller/Movie.Controller");
const router = Router();


router.get("/sitemap.xml",SiteMap);
router.get("/staticmap.xml",StaticSiteMap)


module.exports = router;