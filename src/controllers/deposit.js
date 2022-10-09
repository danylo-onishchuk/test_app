import pool from '../initDB.js';
import checkXToken from '../helpers/checkXToken.js';

export default async function depositRun(req, res) {
  try {
    await makeDeposit(req, res);
  } catch (error) {
    res.status = 500;
    res.send(error);
  }
}

async function makeDeposit(req, res) {
  const {
    username,
    amount,
  } = req.body;

  const {
    token,
  } = req.headers;

  if (!username || !amount) {
    res.statusCode = 400;
    const responce = {
      message: 'error',
      messageDescription: 'Not successful, check if username or amount exist',
    };
    res.send(responce);

    return;
  }

  const usersData = await pool.query('SELECT id, balance FROM users WHERE username = $1', [username]);

  const [user] = usersData.rows;

  if (!user) {
    res.statusCode = 400;
    const responce = {
      message: 'error',
      messageDescription: 'No such user',
    };
    res.send(responce);

    return;
  }

  const isTokenValidated = await checkXToken(user.id, token);

  if (!token || !isTokenValidated) {
    res.statusCode = 401;
    const responce = {
      message: 'unauthorized',
      messageDescription: 'Not successful, invalid token',
    };
    res.send(responce);

    return;
  }

  const usersUpdateInfo = await pool.query(
    'UPDATE users SET balance = $1 WHERE id = $2 RETURNING balance',
    [user.balance + Number(amount), user.id],
  );
  const [updatedUser] = usersUpdateInfo.rows;

  const depositsInfo = await pool.query(
    'INSERT INTO deposits (user_id, amount) VALUES ($1, $2) RETURNING id',
    [user.id, Number(amount)],
  );
  const [deposit] = depositsInfo.rows;

  res.statusCode = 200;
  const responce = {
    message: 'success',
    messageDescription: 'Success',
    balance: updatedUser.balance,
    depositId: deposit.id,
  };

  res.send(responce);
}
