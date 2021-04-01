import db from "./src/db";
import { app } from "./src/app";
import repl from "repl";
import { boardingPassService } from "./src/services";

let replServer = repl.start({
  prompt: "Invites Console > ",
});

import fs from "fs";

function writePdf(path: string, buffer: Buffer) {
  fs.open(path, "w", function (err, fd) {
    if (err) {
      throw "could not open file: " + err;
    }

    fs.write(fd, buffer, 0, buffer.length, null, function (err) {
      if (err) throw "error writing file: " + err;
      fs.close(fd, function () {
        console.log("wrote the file successfully");
      });
    });
  });
}

replServer.context.db = db;
replServer.context.app = app;
replServer.context.boardingPassService = boardingPassService;
replServer.context.writePdf = writePdf;
