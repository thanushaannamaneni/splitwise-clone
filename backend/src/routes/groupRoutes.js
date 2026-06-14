const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Group routes working" });
});

const {
  createGroup,
  addMember,
  addExpense
} = require("../controllers/groupController");

router.post("/create", createGroup);
router.post("/add-member", addMember);
router.post("/add-expense", addExpense);

module.exports = router;
