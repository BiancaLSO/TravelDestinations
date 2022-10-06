//connection to database
const mongoose = require("mongoose");

async function main() {
  await mongoose.connect("mongodb+srv://traveldestinations:traveldestinations1234@travelcluster.xpbsjto.mongodb.net/TravelDestinations");
  // const connection = mongoose.connection;
}

main().catch((err) => console.log(err));

const schema = mongoose.Schema;
const ObjectId = require("mongodb").ObjectId;
const bodyParser = require("body-parser");

//require framework
const express = require("express");
const app = express();
const port = 8082;
// add router from express

//for cors
var cors = require("cors");
app.use(cors());

// for generating token
const bcrypt = require("bcrypt");
var passport = require("passport");
var jwt = require("jsonwebtoken");

//our destination Schema
const destinationSchema = new schema({
  name: { type: String },
  location: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  description: { type: String },
  img: { type: String },
});

//our user Schema
const userSchema = new schema({
  username: { type: String },
  password: { type: String },
});
const userModel = mongoose.model("User", userSchema);
userModel.createCollection().then(function (collection) {
  console.log("Collection is created!");
});

//parser for body
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//inserts an object to my mongo
async function addAnObject(myObject) {
  myObject.save(function (err) {
    if (err) console.log(err);
    console.log(myObject);
  });
}

// get request for all data
app.get("/", async (request, response) => {
  const destinationModel = mongoose.model("Destination", destinationSchema);
  const destinations = await destinationModel.find({});
  try {
    response.send(destinations);
  } catch (error) {
    response.status(500).send(error);
  }
});

//post request from create form
app.post("/", (req, res) => {
  res.status(200).json({ info: "we got POST request" });
  console.log(req.body);
  const destinationModel = mongoose.model("Destination", destinationSchema);
  const myObject = new destinationModel({
    name: req.body.name,
    location: req.body.location,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    description: req.body.description,
    img: req.body.img,
    // make Date.parse();
  });

  addAnObject(myObject).catch(console.dir);
});

// requests for Update form
app.get("/:myID", function (req, res) {
  const destinationModel = mongoose.model("Destination", destinationSchema);
  const destination = destinationModel.findOne({ _id: req.params.myID }, function (err, destination) {
    if (err) {
      console.log(err);
    } else {
      console.log("Result: ", destination);
      res.status(200).json(destination);
    }
  });
});
app.put("/:myID", function (req, res) {
  console.log(req.params.myID);
  const destination = {
    name: req.body.name,
    location: req.body.location,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    description: req.body.description,
    img: req.body.img,
  };
  destination._id = req.params.myID;

  console.log(destination);

  const destinationModel = mongoose.model("Destination", destinationSchema);
  destinationModel.findOneAndUpdate({ _id: req.params.myID }, destination, (err, result) => {
    if (err) res.status(422).json(err);
    else res.status(200).json({ message: "Update success" });
  });
});

// request for Deleting
app.delete("/:myID", function (req, res) {
  const destinationModel = mongoose.model("Destination", destinationSchema);
  destinationModel.findOneAndDelete({ _id: req.params.myID }, (err, result) => {
    if (err) res.status(422).json(err);
    else res.status(200).json({ message: "Delete success" });
  });
});

// endpoint for Sign Up
app.post("/auth/signup", (req, res) => {
  const user = new userModel({
    username: req.body.username,
    password: req.body.password,
  });
  user.save(function (err) {
    if (err) console.log(err);
    console.log(user);
  });

  // res.status(200).json(token);
});
app.get("/auth/login", (req, res) => {
  userModel.findOne({ username: req.body.username, password: req.body.password }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      const token = jwt.sign({ _id: user._id }, "secretkey");
      console.log(token);
      // res.status(200).json(token);
      res.status(200).json(token);
      // res.status(200).
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use(express.static("public"));
