import pool from '../initDB.js';

export default async function checkXToken(userId, token) {
  const userTokensData = await pool.query('SELECT token FROM tokens WHERE user_id = $1', [userId]);
  const [userToken] = userTokensData.rows;

  if (userToken.token === token) {
    return true;
  }

  return false;
}
