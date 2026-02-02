import dotenv from "dotenv";
import app from "./app";
import { ensureSchema, getDb } from "./db";

dotenv.config();
ensureSchema();
getDb();

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
