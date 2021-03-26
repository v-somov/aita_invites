import db from "../src/db";

beforeEach("truncating db", () => {
  return db.none("TRUNCATE courses RESTART IDENTITY");
});
