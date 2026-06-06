const express = require("express");
const router = express.Router();
const { searchEverything } = require("../controllers/search");
const { validateSearchQuery } = require("../middleware/search"); 
router.get("/", validateSearchQuery, searchEverything);

module.exports = router;