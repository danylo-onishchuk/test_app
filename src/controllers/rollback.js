import db from '../initDB.js';
import checkXToken from '../helpers/checkXToken.js';

export default async function rollbackRun(req, res) {
  try {
    await rollback(req, res);
  } catch (error) {
    res.status = 500;
    res.send(error);
  }
}

async function rollback(req, res) {
  const {
    depositId,
  } = req.body;

  const {
    token,
  } = req.headers;

  if (!depositId) {
    res.statusCode = 400;
    const responce = {
      message: 'error',
      messageDescription: 'Not successful, check if depositId exist',
    };
    res.send(responce);

    return;
  }

  const depositsData = await db.query('SELECT id, user_id, amount FROM deposits WHERE id = $1', [depositId]);
  const [deposit] = depositsData;

  if (!deposit) {
    res.statusCode = 400;
    const responce = {
      message: 'unknown',
      messageDescription: 'Not successful, invalid deposit',
    };

    res.send(responce);

    return;
  }

  const isTokenValidated = await checkXToken(deposit.user_id, token);

  if (!token || !isTokenValidated) {
    res.statusCode = 401;
    const responce = {
      message: 'unauthorized',
      messageDescription: 'Not successful, invalid token',
    };

    res.send(responce);

    return;
  }

  const [user] = await db.query(
    'SELECT id, balance FROM users WHERE id = $1',
    [deposit.user_id],
  );

  const [updatedUser] = await db.query(
    'UPDATE users SET balance = $1 WHERE id = $2 RETURNING balance',
    [user.balance - deposit.amount, user.id],
  );

  await db.query('DELETE FROM deposits WHERE id = $1', [deposit.id]);

  res.statusCode = 200;
  const responce = {
    message: 'success',
    messageDescription: 'Success',
    balance: updatedUser.balance,
  };

  res.send(responce);
}
