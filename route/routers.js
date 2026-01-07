const { Router } = require("express");
const { GetAll, GetOne, Delete, Update, ByPage, SiteMap, StaticSiteMap } = require("../controller/Movie.Controller");
const router = Router();


router.get("/film",GetAll);
router.get("/sitemap.xml",SiteMap);
router.get("/staticmap.xml",StaticSiteMap)
router.get("/film/:id",GetOne);
router.delete("/film/:id",Delete);
router.put("/film/:id",Update);
router.get("/movies",ByPage);

module.exports = router;