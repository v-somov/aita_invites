import db from "../src/db";
import { User, BoardingPass } from "../src/models";

export const defaultUser = {
  name: "test",
  distance: 10,
  hours: 1,
};

export const createUser = async (user: User): Promise<User> => {
  return await db.one(
    `insert into users(name, distance, hours) values($1, $2, $3) returning *`,
    [user.name, user.distance, user.hours]
  );
};

export const createBoardingPass = async (
  boardPass: BoardingPass
): Promise<BoardingPass> => {
  return await db.one(
    `insert into boarding_passes(invite_code, user_id, status) values($1, $2, $3) returning *`,
    [boardPass.invite_code, boardPass.user_id, boardPass.status]
  );
};
