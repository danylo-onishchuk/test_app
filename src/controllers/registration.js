import { v4 as uuidv4 } from 'uuid';
import pool from '../initDB.js';
import validateData from '../helpers/validateData.js';

export default async function registerRun(req, res) {
  try {
    await register(req, res);
  } catch (error) {
    res.status = 500;
    res.send(error);
  }
}

async function register(req, res) {
  const {
    username,
    password,
  } = req.body;

  if (!username || !password) {
    res.statusCode = 400;
    const responce = {
      message: 'error',
      messageDescription: 'Not successful, check if username or password exist',
    };
    res.send(responce);

    return;
  }

  if (!validateData(username) || !validateData(username)) {
    res.statusCode = 400;
    const responce = {
      message: 'error',
      messageDescription: 'Not successful, check if username or password valid',
    };
    res.send(responce);

    return;
  }

  const usersData = await pool.query('SELECT id FROM users WHERE username = $1', [username]);

  if (usersData.rows.length !== 0) {
    res.statusCode = 400;
    const responce = {
      message: 'duplicate',
      messageDescription: 'Not successful, such user already exists',
    };

    res.send(responce);

    return;
  }

  const queryData = await pool.query(
    'INSERT INTO users (username, password, balance) VALUES ($1, $2, $3) RETURNING id',
    [username, password, 0],
  );

  const [newUser] = queryData.rows;
  const newToken = uuidv4();

  await pool.query(
    'INSERT INTO tokens (user_id, token) VALUES ($1, $2) RETURNING *',
    [newUser.id, newToken],
  );

  res.statusCode = 200;
  const responce = {
    message: 'success',
    messageDescription: 'Success',
  };

  res.send(responce);
}
