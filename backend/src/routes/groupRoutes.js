const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Group routes working" });
});

const { createGroup } = require("../controllers/groupController");

router.post("/create", createGroup);

module.exports = router;
