const pool = require("../db/db");

const createGroup = async (req, res) => {
  try {
    const { name, created_by } = req.body;

    const group = await pool.query(
      `INSERT INTO groups(name, created_by)
       VALUES($1,$2)
       RETURNING *`,
      [name, created_by]
    );

    await pool.query(
      `INSERT INTO group_members(group_id, user_id)
       VALUES($1,$2)`,
      [group.rows[0].id, created_by]
    );

    res.status(201).json({
      success: true,
      group: group.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

const addMember = async (req, res) => {
  try {
    const { group_id, user_id } = req.body;

    await pool.query(
      `INSERT INTO group_members(group_id, user_id)
       VALUES($1,$2)`,
      [group_id, user_id]
    );

    res.json({
      success: true,
      message: "Member added successfully"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

const addExpense = async (req, res) => {
  try {
    const {
      group_id,
      paid_by,
      description,
      amount,
      split_type
    } = req.body;

    const expense = await pool.query(
      `INSERT INTO expenses(
        group_id,
        paid_by,
        description,
        amount,
        split_type
      )
      VALUES($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        group_id,
        paid_by,
        description,
        amount,
        split_type
      ]
    );

    res.status(201).json({
      success: true,
      expense: expense.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

const getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;

    const expenses = await pool.query(
      `SELECT *
       FROM expenses
       WHERE group_id = $1
       ORDER BY created_at DESC`,
      [groupId]
    );

    res.json({
      success: true,
      expenses: expenses.rows
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

const getGroupBalance = async (req, res) => {
  try {
    const { groupId } = req.params;

    const membersResult = await pool.query(
      `SELECT user_id
       FROM group_members
       WHERE group_id = $1`,
      [groupId]
    );

    const expensesResult = await pool.query(
      `SELECT *
       FROM expenses
       WHERE group_id = $1`,
      [groupId]
    );

    const members = membersResult.rows;
    const expenses = expensesResult.rows;

    if (members.length === 0) {
      return res.status(404).json({
        message: "No members found in group"
      });
    }

    const balances = {};

    members.forEach(member => {
      balances[member.user_id] = 0;
    });

    expenses.forEach(expense => {
      const share = Number(expense.amount) / members.length;

      members.forEach(member => {
        balances[member.user_id] -= share;
      });

      balances[expense.paid_by] += Number(expense.amount);
    });

    res.json({
      success: true,
      balances
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

module.exports = {
  createGroup,
  addMember,
  addExpense,
  getGroupExpenses,
  getGroupBalance
};
