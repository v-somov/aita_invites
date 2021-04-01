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
    "boarding_passes",
    {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      invite_code: { type: "string", notNull: true },
      status: { type: "string", notNull: true, defaultValue: "pending" }, //change to boarding?
      user_id: {
        type: "int",
        notNull: true,
        foreignKey: {
          name: "boarding_passes_user_id_fk",
          table: "users",
          rules: {
            onDelete: "CASCADE",
            onUpdate: "RESTRICT",
          },
          mapping: {
            user_id: "id",
          },
        },
      },
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
      before update on boarding_passes
      for each row
      execute procedure trigger_set_timestamp();
      `,
      [],
      callback
    );
  }
};

exports.down = function (db) {
  return db.dropTable("boarding_passes");
};

exports._meta = {
  version: 1,
};
