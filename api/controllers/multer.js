const multer = require("multer");
// Create a multer disk storage
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

// Create a file filter, only accept jpeg and png format
const fileFilter = (req, file, callback) => {
  // accept a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    callback(null, true);
  }
  // reject a file
  else {
    callback(new Error("Bad file type"), false);
  }
};

// Config multer
module.exports = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});
