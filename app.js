//connection to database
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://traveldestinations:traveldestinations1234@travelcluster.xpbsjto.mongodb.net/destinations").catch((error) => console.log(error));
const schema = mongoose.Schema;
const ObjectId = require("mongodb").ObjectId;
const uri = "mongodb+srv://traveldestinations:traveldestinations1234@travelcluster.xpbsjto.mongodb.net/destinations";
// const client = new mongodb(uri);
const path = require("path");

const bodyParser = require("body-parser");

//require framework
const express = require("express");
const app = express();
const port = 8082;

//for cors
var cors = require("cors");
app.use(cors());

//our Schema

const destinationSchema = new schema({
  name: { type: String },
  location: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  description: { type: String },
  img: { type: String },
});
//parser for body
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//inserts an object to my mongo
async function addAnObject(myObject) {
  console.log(myObject);
  try {
    const database = client.db("TravelDestinations");
    const names = database.collection("destinations");
    names.insertOne(myObject, function (err, info) {
      console.log("Inserted");
    });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

//get request that goes to create page
app.get("/", (req, res) => {
  res.status(200).json({ info: "we got GET request" });
});

//post request from create form
app.post("/", (req, res) => {
  res.status(200).json({ info: "we got POST request" });
  console.log(req.body);
  const myModel = mongoose.model("Destination", destinationSchema);
  const myObejct = new myModel({
    name: req.body.name,
    location: req.body.location,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    description: req.body.description,
    img: req.body.img,
  });
  myObejct.save(function (err) {
    if (err) console.log(err);
    //   res.status(201).json(Kitty);
  });
  // addAnObject(myObject).catch(console.dir);
  // findId();
});

// app.get("/", function (req, res) {
//   const database = client.db("TravelDestinations");
//   const names = database.collection("destinations");
//   database
//     .collection("destinations")
//     .find()
//     .toArray(function (err, items) {
//       res.send(items[0]._id);
//     });
// });
app.get("/:myID", function (req, res) {
  const database = client.db("TravelDestinations");
  const names = database.collection("destinations");
  console.log(req.params.myID);
  database
    .collection("destinations")
    .find({ _id: new ObjectId(req.params.myID) })
    .toArray(function (err, items) {
      res.send(items[0]);
    });

  // res.status(200).json({ info: "we got GET request" });
});
app.put("/:myID", function (req, res) {
  console.log(req.params.destinationId);

  // dataBaseId === req.params.destinationId
  const database = client.db("TravelDestinations");
  const names = database.collection("destinations");
  database
    .collection("destinations")
    .find()
    .toArray(function (err, items) {
      res.send(items[0]._id);

      // req.params.myID = items[0]._id;
      // const myObject = {
      //   name: items[0].name,
      //   location: items[0].location,
      //   startDate: items[0].startDate,
      //   endDate: items[0].endDate,
      //   description: items[0].description,
      //   img: items[0].img,
      // };
    });

  res.status(200).json({ info: "we got PUT request" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use(express.static("public"));
