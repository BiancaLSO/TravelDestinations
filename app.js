const mongodb = require("mongodb").MongoClient;

const express = require("express");
const app = express();
const port = 8081;

const uri = "mongodb+srv://traveldestinations:traveldestinations1234@travelcluster.xpbsjto.mongodb.net/destinations";
const client = new mongodb(uri);

async function run() {
  try {
    const database = client.db("TravelDestinations");
    const names = database.collection("destinations");
    const exampleObject = { name: "Fuji", location: "Japan", start_date: "12.01.2022", end_date: "13.05.2022", description: "alalalalalalalala", img_url: "img.jpg" };

    names.insertOne(exampleObject, function (err, info) {
      console.log("Inserted");
    });
  } finally {
    // Ensures that the client will close when you finish/error

    await client.close();
  }
}

app.get("/", (req, res) => {
  res.send("Travel destiations");
  run().catch(console.dir);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
