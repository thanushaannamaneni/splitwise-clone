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

module.exports = {
  createGroup,
  addMember
};
