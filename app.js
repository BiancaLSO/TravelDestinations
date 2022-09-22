//connection to database
const mongodb = require("mongodb").MongoClient;
const uri = "mongodb+srv://traveldestinations:traveldestinations1234@travelcluster.xpbsjto.mongodb.net/destinations";
const client = new mongodb(uri);
const path = require("path");

const bodyParser = require("body-parser");

//require framework
const express = require("express");
const app = express();
const port = 8082;

//for cors
var cors = require("cors");
app.use(cors());

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
  const myObject = {
    name: req.body.name,
    location: req.body.location,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    description: req.body.description,
    img: req.body.img,
  };
  addAnObject(myObject).catch(console.dir);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use(express.static("public"));
