const fs = require("fs");

const express = require("express");

const path = require("path");

const ejs = require("ejs");

const { execArgv } = require("process");

const { default: mongoose } = require("mongoose");

const app = express();

const Photo = require(__dirname + "/models/Photo.js");

const fileUpload = require("express-fileupload");

const { fstat } = require("fs");

// Connect DB
mongoose.connect("mongodb://127.0.0.1:27017/pcat-test-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// TEMPLATE ENGINE
app.set("view engine", "ejs");
// MIDDLE WARES
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(fileUpload());

// ROUTES
app.get("/", async (req, res) => {
  const photos = await Photo.find({}).sort("-dateCreated");
  res.render("index", {
    photos,
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.get("/photos/:id", async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render("photo", {
    photo,
  });
});

app.post("/photos", async (req, res) => {
  const uploadDir = "public/uploads";

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadeImage = req.files.image;
  let uploadPath = __dirname + "/public/uploads/" + uploadeImage.name;

  uploadeImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: "/uploads/" + uploadeImage.name,
    });

    res.redirect("/");
  });
});

const port = 3000;
app.listen(port, (req, res) => {
  console.log(`Server started on ${port} port`);
});
