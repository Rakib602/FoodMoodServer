const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 4000;

//middleware
app.use(cors())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.anpif.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
    console.log('Hitting the database');
//   client.close();
});
async function run() {
    try {
        await client.connect();
        const database = client.db('foodMenu');
        const foodCollection = database.collection('foods');

        // Get foods API
        app.get('/foods', async (req, res) => {
            const cursor = foodCollection.find({});
            const foods = await cursor.toArray();
            res.send(foods);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('My first database')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})