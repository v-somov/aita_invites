import db from "../db";
import { ArrivedUser } from "../models";

export const latestArrivedUser = async (): Promise<ArrivedUser> => {
  return db.one(
    `select users.name, users.distance, users.hours
     from boarding_passes
     join users on users.id = boarding_passes.user_id
     where boarding_passes.status = 'arrived'
     order by boarding_passes.updated_at desc limit 1;`
  );
};

export const arrivedUsers = async (since: Date): Promise<ArrivedUser[]> => {
  return db.query(
    `select users.name, users.distance, users.hours, boarding_passes.updated_at as boarding_pass_updated_at
     from boarding_passes
     left join users on boarding_passes.user_id = users.id
     where boarding_passes.status = 'arrived' and boarding_passes.updated_at > to_timestamp($1, $2) + interval '1 millisecond'
     order by boarding_passes.updated_at desc;`,
    [
      since.toISOString().replace("T", " ").replace("Z", ""),
      "YYYY-MM-DD HH24:MI:SS.MS",
    ]
  );
};
