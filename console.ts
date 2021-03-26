import db from "./src/db";
import repl from "repl";

let replServer = repl.start({
  prompt: "Invites Console > "
});

replServer.context.db = db;
