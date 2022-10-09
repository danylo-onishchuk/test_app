import pool from '../initDB.js';
import checkXToken from '../helpers/checkXToken.js';

export default async function buyGameRun(req, res) {
  try {
    await buyGame(req, res);
  } catch (error) {
    res.status = 500;
    res.send(error);
  }
}

async function buyGame(req, res) {
  const {
    gameId,
    username,
  } = req.body;

  const {
    token,
  } = req.headers;

  if (!gameId || !username) {
    res.statusCode = 400;
    const responce = {
      message: 'error',
      messageDescription: 'Not successful, check if gameId and username exist',
    };
    res.send(responce);

    return;
  }

  const usersData = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  const [user] = usersData.rows;

  const isTokenValidated = await checkXToken(user.id, token);

  if (!token || !isTokenValidated) {
    res.statusCode = 401;
    const responce = {
      message: 'unauthorized',
      messageDescription: 'Not successful, invalid token or username',
    };

    res.send(responce);

    return;
  }

  const gamesData = await pool.query('SELECT * FROM games WHERE id = $1', [gameId]);
  const [game] = gamesData.rows;

  if (gamesData.rows.length === 0) {
    res.statusCode = 400;
    const responce = {
      message: 'unknown',
      messageDescription: 'Not successful, unknown game',
    };

    res.send(responce);

    return;
  }

  if (user.id === game.creator_id) {
    res.statusCode = 403;
    const responce = {
      message: 'error',
      messageDescription: 'Not successful, you cant buy your own game',
    };

    res.send(responce);

    return;
  }

  if (user.balance < game.price) {
    res.statusCode = 403;
    const responce = {
      message: 'insufficient_funds',
      messageDescription: 'Not successful, insufficient funds',
    };

    res.send(responce);

    return;
  }

  const userActualBalance = await transferFundsToCreator(user, game);

  res.statusCode = 200;
  const responce = {
    message: 'success',
    gameId: 'Success',
    balance: userActualBalance,
  };

  res.send(responce);
}

async function transferFundsToCreator(user, game) {
  const creatorData = await pool.query(
    'SElECT balance FROM users WHERE id = $1',
    [game.creator_id],
  );
  const [creator] = creatorData.rows;

  await pool.query(
    'UPDATE users SET balance = $1 WHERE id = $2',
    [creator.balance + game.price, game.creator_id],
  );

  const userUpdatedData = await pool.query(
    'UPDATE users SET balance = $1 WHERE id = $2 RETURNING balance',
    [user.balance - game.price, user.id],
  );
  const [userUpdated] = userUpdatedData.rows;

  return userUpdated.balance;
}
