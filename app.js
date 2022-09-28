const express = require("express");

const path = require("path");

const ejs = require("ejs");

const { execArgv } = require("process");

const { default: mongoose } = require("mongoose");

const app = express();

const Photo = require(__dirname + "/models/Photo.js");

// Connect DB
mongoose.connect('mongodb://127.0.0.1:27017/pcat-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// TEMPLATE ENGINE
app.set("view engine", "ejs");
// MIDDLE WARES
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// ROUTES
app.get("/", async (req, res) => {
  const photos = await Photo.find({});
  res.render("index", {
    photos
  })
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/photos", async (req, res) => {
  await Photo.create(req.body);
  res.redirect("/");
});

const port = 3000;
app.listen(port, (req, res) => {
  console.log(`Server started on ${port} port`);
});
