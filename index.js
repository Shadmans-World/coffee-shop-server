const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bho7r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("CoffeeDB");
    const coffeeCollection = database.collection("coffee")

    app.post('/coffee',async(req,res)=>{
      const coffee = req.body;
      console.log(coffee)
      const result = await coffeeCollection.insertOne(coffee)
      res.send(result)
    })

    // READ Coffee data
    app.get('/coffee',async(req,res)=>{
      const cursor = coffeeCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // Read Single Coffee Data
    app.get('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query)
      res.send(result)
    })

    app.delete('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    })

    app.put('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const options = {upsert:true}
      const updatedCoffee = req.body;
      const coffee = {
        $set:{
          name:updatedCoffee.name, 
          quantity:updatedCoffee.quantity, 
          supplier:updatedCoffee.supplier,
          taste:updatedCoffee.taste,
          category:updatedCoffee.category,
          details:updatedCoffee.details,
          photo:updatedCoffee.photo,

        }
       
      }
      const result = await coffeeCollection.updateOne(query,coffee,options)
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);



app.get('/',(req,res)=>{
    res.send("You are looking for coffee db? go => http://localhost:5000/coffee/")
})

app.listen(port,()=>{
    console.log("This Server is running on PORT: ",port)
})
