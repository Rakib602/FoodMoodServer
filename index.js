const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 4000;

app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.anpif.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//     console.log('Hitting the database');
// //   client.close();
// });
async function run() {
    try {
      await client.connect();
      const database = client.db("foodMenu");
      const foodCollection = database.collection("foods");
      const orderCollection = database.collection("orders");

      // Get foods API
      app.get("/foods", async (req, res) => {
        const cursor = foodCollection.find({});
        const foods = await cursor.toArray();
        res.send(foods);
      })

      // Post new foods API
      app.post('/newfoods', async (req, res) => {
        const newFoods = req.body;
        const result = await foodCollection.insertOne(newFoods);

        console.log('Got new food', req.body);
        console.log('Added new foods', result);
        res.json(result);
      })

      // Post all order API 
      app.post('/orders', async (req, res) => {
        const newOrder = req.body;
        const result = await orderCollection.insertOne(newOrder);

        console.log('Orderd food', req.body);
        console.log('Added Order', result);
        res.json(result);
      })
      // get all orderd API 
      app.get('/allorderd', async (req, res) => {
        const cursor = orderCollection.find({});
        const foods = await cursor.toArray();
        res.send(foods);
      })

      // delete from order 
      app.delete('/allorderd:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }
        const result = await orderCollection.deleteOne(query);
        console.log(result)

        console.log('deleting with ID', id)
        res.send(result);
      })

      app.get('/allorderd/:email', async (req, res) => {
        console.log(req.params.email)
        const result = await orderCollection.find({
          email:req.params.email
        }).toArray();

        console.log(result)
        res.send(result)
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