const { Router } = require("express");
const { GetAll, GetOne, Delete, Update, ByPage } = require("../controller/Movie.Controller");
const router = Router();


router.get("/api/film",GetAll);
router.get("/api/film/:id",GetOne);
router.delete("/api/film/:id",Delete);
router.put("/api/film/:id",Update);
router.get("/api/movies",ByPage);

module.exports = router;