import pool from '../initDB.js';

export default async function checkXTokenOfCreator(xToken) {
  const userTokensData = await pool.query('SELECT user_id FROM tokens WHERE token = $1', [xToken]);
  const [userToken] = userTokensData.rows;

  if (userToken.user_id) {
    return userToken.user_id;
  }

  return false;
}
