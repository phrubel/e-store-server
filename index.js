const express = require('express')
const cors = require('cors')
const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yo3qi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("eStore").collection("products");
  const ordersCollection = client.db("eStrore").collection("Orders");

  // post all products
  app.post('/addProducts', (req, res) => {
    const newProduct = req.body;
    productCollection.insertOne(newProduct)
      .then(result => {
        res.send(result.insertedCount > 0)
        console.log(result.insertedCount)
      })
  })

// get products
  app.get('/products', (req, res) => {
    productCollection.find()
      .toArray((err, product) => {
        res.send(product)
        console.log(err)
      })
  })

  // get all products for admin
  app.get('/allProducts', (req, res) => {
    productCollection.find()
      .toArray((err, product) => {
        res.send(product)
      })
  })

  // get specific product
  app.get("/product/:id", (req, res) => {
    const id = ObjectID(req.params.id)
    productCollection.find({ _id: id })
      .toArray((err, documents) => {
        res.send(documents[0])

      })
  })

  // post order
  app.post('/addOrder', (req, res) => {
    const order = req.body
    console.log(order);
    ordersCollection.insertOne(order)
      .then(result => {
        console.log("order success", result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })


// get order history
  app.get('/orderHistory', (req, res) => {
    console.log(req.query.email)
    ordersCollection.find({orderOwnerEmail: req.query.email })
      .toArray((err, item) => {
        res.send(item)
      })

  })

  // get single order
  app.get('/order', (req, res) => {
    ordersCollection.find()
      .toArray((err, product) => {
        res.send(product)
      })
  })

// product delete
  app.delete('/product/:id', (req, res) => {
    const id = ObjectID(req.params.id)
    productCollection.findOneAndDelete({ _id: id })
      .then(result => {
        res.send({ success: !!result.value })
      })

  })


});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})