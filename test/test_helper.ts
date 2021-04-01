import db from "../src/db";

beforeEach("truncating db", () => {
  return db.none("TRUNCATE users, boarding_passes  RESTART IDENTITY");
});
