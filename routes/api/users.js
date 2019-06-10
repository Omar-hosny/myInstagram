const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
// var gravatar = require("gravatar");
const multer = require("multer");
const path = require("path");

// Load User model
const User = require("../../models/User");

// load validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public

router.get("/test", (req, res) => res.json({ message: "users works" }));

// @route   GET api/users/register
// @desc    Register user
// @access  Public

router.post("/register", (req, res) => {
  // check for validation
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email is already exist";
      return res.status(400).json(errors);
    } else {
      // const avatar = gravatar.url(req.body.email, {
      //   s: "200", //Size
      //   r: "pg", // Rating
      //   d: "mm"
      // });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// for upload avatar

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 },
//   fileFilter: function(req, file, cb) {
//     checkFileType(file, cb);
//   }
// });
// // Check File Type
// function checkFileType(file, cb) {
//   // Allowed ext
//   const filetypes = /jpeg|jpg|png|gif/;
//   // Check ext
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb("Error: Images Only!");
//   }
// }

// router.post(
//   "/avatar",
//   passport.authenticate("jwt", { session: false }),
//   upload.single("avatar"),
//   (req, res) => {
//     const newUser = {};
//     if (req.file.avatar) newUser.avatar = req.file.avatar;
//     User.findOne({ user: req.user.id })
//       .then(user => {
//         if (user) {
//           User.findOneAndUpdate(
//             { user: req.user.id },
//             { $set: newUser },
//             { new: true }
//           ).then(user => res.json(user));
//         } else {
//           // Save Profile
//           new User(newUser).save().then(user => res.json(user));
//         }
//       })
//       .catch(err => res.json("something went wrong.. !"));
//   }
// );

// @route   GET api/users/login
// @desc    login user/ return token
// @access  Public
router.post("/login", (req, res) => {
  // check for validation
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    // check user
    if (!user) {
      errors.email = "User not found !..";
      res.status(404).json(errors);
    }
    // check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        //create JWT payload
        const payload = {
          id: user.id,
          name: user.name,
          // avatar: user.avatar,
          followers: user.followers,
          following: user.following
        };
        // sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password incorrect !";
        res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc   return current user
// @access  private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

// @route   POST api/users/follow/:id
// @desc    follow user
// @access  Private
router.post(
  "/follow/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // first find follower user
    User.findById(req.params.id)
      .then(user => {
        const followedUser = user.id;
        if (
          user.followers.filter(item => item.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ alreadyfollowed: "You already followed this user" });
        }
        // add user to followers
        user.followers.unshift({ user: req.user.id });
        user.save();

        //  second: find  that user who make the follow req
        User.findById(req.user.id).then(user1 => {
          // add followeduser to following
          user1.following.unshift({ user: followedUser });
          user1.save().then(user1 => res.json(user1));
        });
      })
      .catch(err => res.status(404).json({ usernotfound: "No user found.." }));
  }
);

module.exports = router;
