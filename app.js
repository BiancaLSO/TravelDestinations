// import package for Mongoose Validation
// const { isEmail } = require("validator");
const { isDate, isEmail } = require("validator");
// env file
const dotenv = require("dotenv");
dotenv.config();
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
app.options("*", cors());

// for generating token
const bcrypt = require("bcrypt");
var passport = require("passport");
var jwt = require("jsonwebtoken");
var passportJWT = require("passport-jwt");

//our destination Schema
const destinationSchema = new schema({
  name: {
    type: String,
    required: [true, "Please enter a article name"],
    unique: true,
  },
  location: { type: String, required: [true, "Please enter a location name"] },
  startDate: {
    type: Date,
    required: [true, "Please enter a start date for the trip"],
    validate: [isDate, "Please enter the correct date format: YYYY/MM/DD"],
  },
  endDate: {
    type: Date,
    required: [true, "Please enter an end date for the trip"],
    validate: [isDate, "Please enter the correct date format: YYYY/MM/DD"],
  },
  description: {
    type: String,
    required: [true, "Please enter a description about the trip"],
  },
  img: { type: String },
});

// User Scehma for creating the User Model
const userSchema = new schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  username: {
    type: String,
    required: [true, "Please enter a valid username"],
    async validate(username) {
      if (username === "Hi") {
        let user;

        try {
          user = await userModel.findOne({ username });
        } catch (e) {
          console.error("[User Model] An error occurred during validation.");
          console.error(e);
          throw e; // rethrow error if findOne call fails since fruit will be null and this validation will pass with the next statement
        }

        if (user) throw new Error(`A fruit for ${username} already exists.`);
      }
    },
  },
  email: {
    type: String,
    required: [true, "Please enter an email account"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email account"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    unique: true,
    minlength: [8, "Minimum password length is 8 characters"],
  },
});
userSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  console.log(hash);
  next();
});
userSchema.methods.isValidPassword = async function (password) {
  console.log(await bcrypt.compare(password, this.password));
  return await bcrypt.compare(password, this.password);
};
const userModel = mongoose.model("User", userSchema);
userModel.createCollection().then(function (collection) {
  console.log("Collection is created!");
});

//parser for body
app.use(express.json());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

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
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  user.save(function (err) {
    if (err) console.log(err);
    console.log(user);
  });
  res.status(200).json({ info: "we got POST request" });
});
app.get("/auth/login", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Allow-Headers", "accept, content-type");
  res.header("Access-Control-Max-Age", "1728000");
  console.log(req.body);
  userModel.findOne({ username: req.body.username }, async (err, user) => {
    if (err) {
      console.log(err);
    } else {
      console.log(user);
      // let passwordInput = user.password;
      const isValid = await bcrypt.compare(req.body.password, user.password);
      console.log(isValid);
      if (isValid) {
        const token = jwt.sign({ _id: user._id }, process.env.jwt_secret);
        console.log(token);
        res.status(200).json(token);
      }
    }
  });
});
// decode the token
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "mysecretword",
};
const strategy = new JwtStrategy(jwtOptions, async function (jwt_payload, next) {
  const user = await userModel.findOne({ _id: jwt_payload._id });
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});
passport.use(strategy);
app.use(passport.initialize());

// middlewear
app.use((req, res, next) => {
  req.username;
  next();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use(express.static("public"));
