import db from '../initDB.js';

export default async function checkXTokenOfCreator(token) {
  const [userToken] = await db.query('SELECT user_id FROM tokens WHERE token = $1', [token]);

  if (userToken) {
    return userToken.user_id;
  }

  return false;
}
