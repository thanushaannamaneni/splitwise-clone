const express = require("express");
const router = express.Router();

const {
  createGroup,
  addMember,
  addExpense,
  getGroupExpenses,
  getGroupBalance
} = require("../controllers/groupController");

router.get("/test", (req, res) => {
  res.json({ message: "Group routes working" });
});

router.post("/create", createGroup);
router.post("/add-member", addMember);
router.post("/add-expense", addExpense);

router.get("/:groupId/expenses", getGroupExpenses);
router.get("/:groupId/balance", getGroupBalance);

module.exports = router;
