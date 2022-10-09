const Photo = require("../models/Photo");
const fs = require("fs");
const path = require("path");

exports.getIndexPage = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render("edit", {
    photo,
  });
};

exports.getAboutPage = (req, res) => {
  res.render("about");
};

exports.getEditPage = (req, res) => {
  res.render("add");
};
