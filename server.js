const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const avatar = require("./routes/api/avatar");

const app = express();

// app.use(express.static(__dirname));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/uploads", express.static("uploads"));

// test route
app.get("/", (req, res) => res.send("Hello world..!"));

// Connect to mongoDB
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => console.log("Connected to mongoDB..."))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);
app.use("/api/avatar", avatar);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port} `));
