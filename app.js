const mongodb = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = 8081;
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const uri = "mongodb+srv://traveldestinations:traveldestinations1234@travelcluster.xpbsjto.mongodb.net/destinations";
const client = new mongodb(uri);
const path = require("path");

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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/create.html"));
});
app.post("/create", (req, res) => {
  const myObject = {
    name: req.body.name,
    location: req.body.location,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    description: req.body.description,
    img: req.body.img,
  };
  res.send("Name is:" + req.body.name);
  // res.sendFile(path.join(__dirname + "/index.html"));
  addAnObject(myObject).catch(console.dir);
});
app.get("/create", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});
// this function shows our database at the url /destinations
app.get("/destinations", (req, resp) => {
  const database = client.db("TravelDestinations");
  database
    .collection("destinations")
    .find({})
    .toArray((err, result) => {
      if (err) throw err;
      resp.send(result);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
app.use(express.static("public"));
