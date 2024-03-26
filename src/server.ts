import "dotenv/config";
import express from "express";
import { connectToWhatsApp } from "./whatsapp/whatsapp.service";
import { db } from "./db";
import { users } from "./db/schema";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, async () => {
  const res = await db.select().from(users);
  console.log(res);

  await connectToWhatsApp();
  console.log("ntr-bot listening on port 3000!");
});
