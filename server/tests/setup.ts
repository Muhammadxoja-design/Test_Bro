import path from "path";

process.env.NODE_ENV = "test";
process.env.DB_PATH = path.resolve(process.cwd(), "data", "test.sqlite");
