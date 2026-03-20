import express from "express";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

import Ticket from "../database/Ticket.js";

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "supersecret",
  resave: false,
  saveUninitialized: false
}));

// Login page
app.get("/", (req, res) => {
  res.render("login");
});

// Login Process
app.post("/login", (req, res) => {
  const { password } = req.body;

  if (password !== process.env.DASHBOARD_PASS)
    return res.send("Invalid Password");

  req.session.auth = true;
  res.redirect("/panel");
});

// Dashboard
app.get("/panel", async (req, res) => {
  if (!req.session.auth) return res.redirect("/");

  const tickets = await Ticket.find();
  res.render("panel", { tickets });
});

// Delete Ticket
app.post("/delete-ticket", async (req, res) => {
  if (!req.session.auth) return res.redirect("/");

  const { id } = req.body;
  await Ticket.deleteOne({ _id: id });

  res.redirect("/panel");
});

app.listen(process.env.PORT, () =>
  console.log("[DASHBOARD] Running on port " + process.env.PORT)
);
