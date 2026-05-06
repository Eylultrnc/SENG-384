const pool = require("../db");

const logActivity = async ({
  userId,
  actionType,
  targetEntity,
  resultStatus = "SUCCESS",
  ipAddress
}) => {
  try {
    await pool.query(
      `INSERT INTO activity_logs 
       (user_id, action_type, target_entity, result_status, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, actionType, targetEntity, resultStatus, ipAddress]
    );
  } catch (err) {
    console.error("LOG ACTIVITY ERROR:", err);
  }
};

module.exports = logActivity;