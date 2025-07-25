var express = require("express");
var router = express.Router();
const multer = require("multer");

const fs = require("fs");
const path = require("path");

const publicUploadPath = path.join(__dirname, "../public/uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdir(publicUploadPath, { recursive: true }, (err) => {
      cb(err, publicUploadPath);
    });
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.any(), function (req, res, next) {
  try {
    let file = req.files;
    let fileDetails = file.map((el) => {
      return `${process.env.API_POINT}uploads/${el.filename}`;
    });
    res.status(201).json({
      status: "Success",
      message: fileDetails,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error,
    });
  }
});

module.exports = router;
