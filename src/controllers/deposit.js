import db from '../initDB.js';
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

  const [user] = await db.query('SELECT id, balance FROM users WHERE username = $1', [username]);

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

  const [updatedUser] = await db.query(
    'UPDATE users SET balance = $1 WHERE id = $2 RETURNING balance',
    [user.balance + Number(amount), user.id],
  );

  const [deposit] = await db.query(
    'INSERT INTO deposits (user_id, amount) VALUES ($1, $2) RETURNING id',
    [user.id, Number(amount)],
  );

  res.statusCode = 200;
  const responce = {
    message: 'success',
    messageDescription: 'Success',
    balance: updatedUser.balance,
    depositId: deposit.id,
  };

  res.send(responce);
}
