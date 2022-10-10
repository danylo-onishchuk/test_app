import db from '../initDB.js';

export default async function checkXToken(userId, requestToken) {
  const { token } = await db.one('SELECT token FROM tokens WHERE user_id = $1', [userId]);

  if (token === requestToken) {
    return true;
  }

  return false;
}
