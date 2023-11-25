import { config } from "dotenv";
config();

import express from "express";
const session = require("express-session");
import passport from "passport";
import authRoutes from "./routes/auth";
import getRandomCryptedString from "./helpers/getRandomCryptedString";

// must be done after dotenv config() since it uses env vars
require("./strategies/google");

async function main() {
  const app = express();
  app.use(
    session({
      secret: getRandomCryptedString(),
      resave: false,
      saveUninitialized: false,
    })
  );
  const PORT = process.env.PORT;

  app.use(passport.initialize());
  app.use(passport.session());
  app.use("/api/auth", authRoutes);

  try {
    app.listen(PORT, () =>
      console.log("\x1b[42m", `YTMate backend running on port ${PORT}`)
    );
  } catch (err) {
    console.error("YTMate backend error:", err);
  }
}
main();
