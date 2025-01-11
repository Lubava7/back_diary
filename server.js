import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function getPostgresVersion() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT version()');
    console.log(res.rows[0]);
  } finally {
    client.release();
  }
}

const getRecords = async (req, res) => {
  const client = await pool.connect();
  try {
    const records = await client.query('SELECT * FROM diary_records');
    res.json(records.rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

const addRecord = async (req, res) => {
  console.log('Received request to add record');
  const {
    photo,
    description,
    is_gym_day,
    is_failure,
    is_full_workout,
    date,
    calorie_count,
  } = req.body;
  const client = await pool.connect();

  try {
    console.log('Request body:', {
      'photo length': photo ? photo.length : 0,
      description,
      is_gym_day,
      is_failure,
      is_full_workout,
      date,
      calorie_count,
    });

    const result = await client.query(
      `INSERT INTO diary_records 
      (photo, description, is_gym_day, is_failure, is_full_workout, date, calorie_count) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`,
      [
        photo,
        description,
        is_gym_day,
        is_failure,
        is_full_workout,
        date,
        calorie_count,
      ]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding record:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message,
    });
  } finally {
    client.release();
  }
};

export { pool, getRecords, addRecord, getPostgresVersion };
