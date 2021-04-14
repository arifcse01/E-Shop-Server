const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 4000;
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wapuj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection error', err)
  const itemCollection = client.db(process.env.DB_NAME).collection("items");

  console.log('connection successfully')
  

  app.get('/products', (req, res) => {
    itemCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.get('/product/:id', (req, res) => {
    const id = req.params.id;
    itemCollection.find({_id: ObjectId(id)})
    .toArray((err, documents) => {
      res.send(documents[0])
    })
  })

  app.post('/addProduct', (req, res) => {
    const product = req.body;
    itemCollection.insertOne(product)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.delete('/deleteProduct/:id', (req, res) =>{
    const id = req.params.id;
    itemCollection.deleteOne({_id: ObjectId(id)})
    .then(result => {
      res.send(result.deletedCount > 0);
    })
  })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port);