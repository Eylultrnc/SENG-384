const { Pool } = require('pg');

const pool = new Pool({
  user: 'root',
  host: 'localhost', // Mapped port
  database: 'healthai',
  password: 'root',
  port: 5432,
});

async function checkDB() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'posts';
    `);
    console.log("POSTS COLUMNS:", res.rows);

    const msgs = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'messages';
    `);
    console.log("MESSAGES COLUMNS:", msgs.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

checkDB();
