"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  db.createTable(
    "users",
    {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      name: "string",
      distance: "int",
      hours: "int",
      created_at: {
        type: "timestamp",
        notNull: true,
        defaultValue: new String("now()"),
      },
      updated_at: {
        type: "timestamp",
        notNull: true,
        defaultValue: new String("now()"),
      },
    },
    createUpdatedAtTrigger
  );

  function createUpdatedAtTrigger(err) {
    if (err) {
      callback(err);
      return;
    }
    db.runSql(
      `
      create trigger set_timestamp
      before update on users
      for each row
      execute procedure trigger_set_timestamp();
      `,
      [],
      callback
    );
  }
};

exports.down = function (db) {
  return db.dropTable("users");
};

exports._meta = {
  version: 1,
};
