import { app } from "./app.js";
import { checkDb } from "./db.js";

const PORT = process.env.PORT || 5000;

// Retry DB connection so the app survives the DB starting slowly
async function start(retries = 10) {
  try {
    await checkDb();
    app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
  } catch (err) {
    if (retries === 0) throw err;
    console.log(`DB not ready (${err.message}), retrying in 3s...`);
    setTimeout(() => start(retries - 1), 3000);
  }
}
start();
