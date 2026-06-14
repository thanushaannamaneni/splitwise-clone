const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Group routes working" });
});

const {
  createGroup,
  addMember
} = require("../controllers/groupController");

router.post("/create", createGroup);
router.post("/add-member", addMember);

module.exports = router;
