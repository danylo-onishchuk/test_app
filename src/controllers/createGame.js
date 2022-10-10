import db from '../initDB.js';
import checkXTokenOfCreator from '../helpers/checkXTokenOfCreator.js';

export default async function createGameRun(req, res) {
  try {
    await createGame(req, res);
  } catch (error) {
    res.status = 500;
    res.send(error);
  }
}

async function createGame(req, res) {
  const {
    name,
    title,
    price,
  } = req.body;

  const {
    token,
  } = req.headers;

  if (!name || !title || !price) {
    res.statusCode = 400;
    const responce = {
      message: 'error',
      messageDescription: 'Not successful, check if name, title and price exist',
    };

    res.send(responce);

    return;
  }

  const userId = await checkXTokenOfCreator(token);

  if (!token || userId === false) {
    res.statusCode = 401;
    const responce = {
      message: 'unauthorized',
      messageDescription: 'Not successful, invalid token',
    };

    res.send(responce);

    return;
  }

  const [newGame] = await db.query(
    'INSERT INTO games (name, title, price, creator_id) VALUES ($1, $2, $3, $4) RETURNING id',
    [name, title, price, userId],
  );

  res.statusCode = 200;
  const responce = {
    message: 'success',
    messageDescription: 'Success',
    gameId: newGame.id,
  };

  res.send(responce);
}
