
const cors = require('cors');
const express = require('express');

const { Pool } = require('pg');

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

));
app.use(express.json());


const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'db',
  database: process.env.DB_NAME || 'person_db',
  password: process.env.DB_PASSWORD || 'password',
  port: 5432,
});


app.get('/api/people', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM people ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
});


app.post('/api/people', async (req, res) => {
  const { full_name, email } = req.body;

 
  if (!full_name || !email) {
    return res.status(400).json({ error: "İsim ve email zorunludur." });
  }


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Geçersiz email formatı." });
  }

  try {
    const newUser = await pool.query(
      'INSERT INTO people (full_name, email) VALUES ($1, $2) RETURNING *',
      [full_name, email]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    if (err.code === '23505') { 
      return res.status(409).json({ error: "Bu email adresi zaten kayıtlı." });
    }
    res.status(500).json({ error: "Veritabanı hatası" });
  }
});


app.put('/api/people/:id', async (req, res) => {
  const { id } = req.params;
  const { full_name, email } = req.body;
  try {
    const update = await pool.query(
      'UPDATE people SET full_name = $1, email = $2 WHERE id = $3 RETURNING *',
      [full_name, email, id]
    );
    if (update.rows.length === 0) return res.status(404).json({ error: "Kişi bulunamadı" });
    res.json(update.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Güncelleme hatası" });
  }
});


app.delete('/api/people/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM people WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Silme hatası" });
  }
});


const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
