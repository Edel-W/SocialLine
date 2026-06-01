const express = require("express");
const router = express.Router();


router.get("/" , (req, res) => {
    res.send({ data: "Users data fetched"});
});

router.post("/", (req, res) => {
    res.send( { data: "User created!"});
});

router.put("/:id", (req,res) => {
    res.send( { data: "User data updated!"});
});

router.delete("/:id", (req,res) => {
    res.send( { data: "User deleted!"});
});

module.exports = router;