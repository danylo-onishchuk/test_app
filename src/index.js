import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as registration } from './routes/registration.js';
import { router as token } from './routes/token.js';
import { router as deposit } from './routes/deposit.js';
import { router as rollback } from './routes/rollback.js';
import { router as game } from './routes/game.js';

dotenv.config();

const { HOST, PORT } = process.env;

const app = express();

app.use(cors());
app.use('/registration', json(), registration);
app.use('/token', json(), token);
app.use('/deposit', json(), deposit);
app.use('/rollback', json(), rollback);
app.use('/game', json(), game);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`
    Server is running on http://${HOST}:${PORT}
  `);
});
