const Photo = require("../models/Photo");

const fs = require("fs");

const path = require("path");

exports.getAllPhotos = async (req, res) => {
  const photos = await Photo.find({}).sort("-dateCreated");
  res.render("index", {
    photos,
  });
};

exports.getPhotos = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render("photo", {
    photo,
  });
};

exports.createPhoto = async (req, res) => {
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
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  await photo.save();

  res.redirect(`${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });

  fs.unlink(__dirname + "/../public" + photo.image, (err) => {
    if (err) throw err;
  });

  await Photo.findByIdAndRemove(req.params.id);

  res.redirect("/");
};
