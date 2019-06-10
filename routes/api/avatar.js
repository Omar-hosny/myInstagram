const express = require("express");
const router = express.Router();
const multer = require("multer");
var gravatar = require("gravatar");

const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");

//load Profile model
const Profile = require("../../models/Profile");
//load User model
const User = require("../../models/User");

//load ProfileImage model
const ProfileImage = require("../../models/ProfileImage");

// for upload avatar

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads");
  },
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});
// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("avatar"),
  (req, res) => {
    console.log(req.file);
    const profileImage = new ProfileImage({
      user: req.user.id,
      avatar: req.file.path
    });
    profileImage.save().then(result => res.json(result));
  }
);

router.get("/:id", (req, res) => {
  ProfileImage.findById(req.params.id)
    .then(user => {
      if (!user) {
        res.status(404).json({ error: "there is no profile image" });
      } else {
        res.json(user.avatar);
      }
    })
    .catch(err => res.json(err));
});

module.exports = router;
