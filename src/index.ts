import { runDb } from './db/db';
import { app } from './settings';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  await runDb();
});
