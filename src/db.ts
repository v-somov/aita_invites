import promise from "bluebird";
import pgPromise from "pg-promise";

const options = {
  promiseLib: promise
};

const pgp = pgPromise(options);

const connectionOptions = {
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  database: "aita_invites_" + process.env.NODE_ENV
};

const db = pgp(connectionOptions);

export default db;
