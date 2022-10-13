// Import validator methods
const { isDate, isEmail } = require("validator");

// .env file
const dotenv = require("dotenv");
dotenv.config();

// Import package for Mongoose Validation
const mongoose = require("mongoose");

//for cors
var cors = require("cors");

//connection to database
async function main() {
  await mongoose.connect(
    "mongodb+srv://traveldestinations:traveldestinations1234@travelcluster.xpbsjto.mongodb.net/TravelDestinations"
  );
}

main().catch((err) => console.log(err));

const schema = mongoose.Schema;
const ObjectId = require("mongodb").ObjectId;
const bodyParser = require("body-parser");

// Express
const express = require("express");
const app = express();
const port = 8082;

// Cors
app.use(cors());
app.options("*", cors());

//  Generating Jwt token
const bcrypt = require("bcrypt");
var passport = require("passport");
var jwt = require("jsonwebtoken");
var passportJWT = require("passport-jwt");

const { response } = require("express");

// Destination Schema for creatting the Destination Model
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
      if (username) {
        let user;

        try {
          user = await userModel.findOne({ username });
        } catch (e) {
          console.error("[User Model] An error occurred during validation.");
          console.error(e);
          throw e; // rethrow error if findOne call fails since fruit will be null and this validation will pass with the next statement
        }

        if (user)
          throw new Error(`This username: ${username} already esxists.`);
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

// Encrypting the password pre-saving it
userSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  console.log(hash);
  next();
});

// Comparing method for the clear text password and the encrypted one
userSchema.methods.isValidPassword = async function (password) {
  console.log(await bcrypt.compare(password, this.password));
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("User", userSchema);
userModel.createCollection().then(function (collection) {
  console.log("Collection is created!");
});

// Body parser
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Inserts an object to my mongo
async function addAnObject(myObject) {
  myObject.save(function (err) {
    if (err) console.log(err);
    console.log(myObject);
  });
}

// Decode-ing the token
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.jwt_secret,
};
const strategy = new JwtStrategy(jwtOptions, async function (
  jwt_payload,
  next
) {
  const user = await userModel.findOne({ _id: jwt_payload._id });
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});
passport.use(strategy);
app.use(passport.initialize());

// Get request for all destinations
app.get("/", async (request, response) => {
  const destinationModel = mongoose.model("Destination", destinationSchema);
  const destinations = await destinationModel.find({});
  try {
    response.send(destinations);
  } catch (error) {
    response.status(500).send(error);
  }
});

// Post request for the Create form
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
  });

  addAnObject(myObject).catch(console.dir);
});

// Get request for the displaying the specific destination in the Update form
app.get(
  "/:myID",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    const destinationModel = mongoose.model("Destination", destinationSchema);
    const destination = destinationModel.findOne(
      { _id: req.params.myID },
      function (err, destination) {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json(destination);
        }
      }
    );
    res.redirect(303, "auth/login");
  }
);

// Put request for updating the specific destination
app.put("/:myID", function (req, res) {
  const destination = {
    name: req.body.name,
    location: req.body.location,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    description: req.body.description,
    img: req.body.img,
  };
  destination._id = req.params.myID;

  const destinationModel = mongoose.model("Destination", destinationSchema);
  destinationModel.findOneAndUpdate(
    { _id: req.params.myID },
    destination,
    (err, result) => {
      if (err) res.status(422).json(err);
      else res.status(200).json({ message: "Update success" });
    }
  );
});

// Deleting a specific destination based on id
app.delete("/:myID", function (req, res) {
  const destinationModel = mongoose.model("Destination", destinationSchema);
  destinationModel.findOneAndDelete({ _id: req.params.myID }, (err, result) => {
    if (err) res.status(422).json(err);
    else res.status(200).json({ message: "Delete success" });
  });
});

// Post request for creating a new user
app.post("/auth/signup", (req, res) => {
  const user = new userModel({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  user.save(function (err) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json({ info: "POST request works" });
    }
  });
});

// Post request for log in
app.post("/auth/login", (req, res) => {
  userModel.findOne({ username: req.body.username }, async (err, user) => {
    if (err) {
      console.log(err);
    } else {
      const isValid = await bcrypt.compare(req.body.password, user.password);
      if (isValid) {
        const token = jwt.sign({ _id: user._id }, process.env.jwt_secret);
        res.status(200).json(token);
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use(express.static("public"));
