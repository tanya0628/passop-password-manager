const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb'); 
const bodyparser = require('body-parser')
const cors = require('cors')

dotenv.config()


// Connecting to the MongoDB Client
const url = process.env.MONGO_URI;
const client = new MongoClient(url);
client.connect();

// App & Database
const dbName = process.env.DB_NAME 
const app = express()
const port = 3000 

// Middleware
app.use(bodyparser.json())
app.use(cors())


// Get all the passwords
app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult)
})

// Save a password
// app.post('/', async (req, res) => { 
//     const password = req.body
//     const db = client.db(dbName);
//     const collection = db.collection('passwords');
//     const findResult = await collection.insertOne(password);
//     res.send({success: true, result: findResult})
// })

app.post("/", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const result = await collection.insertOne(req.body);
    res.send({ success: true, insertedId: result.insertedId });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});



// Delete a password by id


app.delete("/", async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) return res.status(400).json({ success: false, error: "Missing _id" });

    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const result = await collection.deleteOne({ _id: new ObjectId(_id) });

    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});



app.listen(port, () => {
    console.log(`Example app listening on  http://localhost:${port}`)
})