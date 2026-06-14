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
    console.log(req.body);
    console.log("split_type =", split_type);
    const dbInfo = await pool.query("SELECT current_database(), current_schema()");
    console.log(dbInfo.rows[0]);
    const expense = await pool.query(
      `INSERT INTO expenses(
        group_id,
        paid_by,
        description,
        amount,
        split_type
      )
      VALUES($1,$2,$3,$4,$5)
      RETURNING id, group_id, paid_by, amount, split_type`,
      [
        group_id,
        paid_by,
        description,
        amount,
        split_type
      ]
    );
    console.log("Inserted:", expense.rows[0]);

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

module.exports = {
  createGroup,
  addMember,
  addExpense
};
