const photoControllers = require("./controllers/photoControllers");
const pageController = require("./controllers/pageController");

const express = require("express");
const { default: mongoose } = require("mongoose");
const { execArgv } = require("process");
const ejs = require("ejs");
const app = express();

const fileUpload = require("express-fileupload");
const methodOverride = require("method-override");

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

app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);
// ROUTES
app.get("/", photoControllers.getAllPhotos);
app.delete("/photos/:id", photoControllers.deletePhoto);
app.get("/photos/:id", photoControllers.getPhotos);
app.post("/photos", photoControllers.createPhoto);
app.put("/photos/:id", photoControllers.updatePhoto);
app.get("/photos/edit/:id", pageController.getIndexPage);
app.get("/about", pageController.getAboutPage);
app.get("/add", pageController.getEditPage);

// PORT
const port = 3000;
app.listen(port, (req, res) => {
  console.log(`Server started on ${port} port`);
});
