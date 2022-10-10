import db from '../initDB.js';

export default async function tokenRun(req, res) {
  try {
    await getToken(req, res);
  } catch (error) {
    res.status = 500;
    res.send(error);
  }
}

async function getToken(req, res) {
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

  const [user] = await db.query(
    'SELECT id, balance FROM users WHERE username = $1 AND password = $2',
    [username, String(password)],
  );

  if (!user) {
    res.statusCode = 401;
    const responce = {
      message: 'unauthorized',
      messageDescription: 'Not successful, invalid username or password',
    };

    res.send(responce);

    return;
  }

  const [{ token }] = await db.query(
    'SELECT token FROM tokens WHERE user_id = $1',
    [user.id],
  );

  const gamesData = await db.query('SELECT id FROM games');

  const gamesIds = gamesData.map((game) => game.id);

  res.statusCode = 200;
  const responce = {
    message: 'success',
    messageDescription: 'Success',
    token,
    balance: user.balance,
    games: gamesIds,
  };

  res.send(responce);
}
