import { runDb } from './db/db';
import { app } from './settings';
import { SETTINGS } from './settings/settings';

app.listen(SETTINGS.PORT, async () => {
  await runDb();
});
