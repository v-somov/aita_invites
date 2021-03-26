import { app } from "./app";
import http from "http";
import { AddressInfo } from "net";

const port: number = parseInt(process.env.PORT) || 9000;
app.set("port", port);

const server = http.createServer(app);

server.listen(port);

server.on("error", onError);
server.on("listening", onListening);

function pipeOrPort(address: string | AddressInfo) {
  return typeof address == "string"
    ? `pipe ${address}`
    : `port ${address.port}`;
}

function onError(error: Error) {
  if (error.syscall != "listen") {
    throw error;
  }

  const bind = pipeOrPort(server.address());

  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges.`);
      return process.exit(1);
    case "EADDRINUSE":
      console.error(`${bind} is already in use.`);
      return process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  const bind = pipeOrPort(server.address());
  console.log(`Listening on ${bind}`);
}
