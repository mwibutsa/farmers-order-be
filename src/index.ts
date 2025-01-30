import "dotenv/config";

import app from "./app";
import http from "http";

const NODE_ENV = process.env.NODE_ENV || "development";
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  if (["dev", "development"].includes(NODE_ENV)) {
    console.log(`server started on port: ${PORT}`);
  }
});
