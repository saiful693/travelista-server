const express = require('express');
require('dotenv').config()
const {
  MongoClient,
  ServerApiVersion,
  ObjectId
} = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ealpifc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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

    const travelCollection = client.db('travelDB').collection('spot');
    const userCollection = client.db('travelDB').collection('user');

    app.get('/spot', async(req, res)=>{
      const cursor=travelCollection.find();
      const result=await cursor.toArray();
      res.send(result);
    })

    app.get('/spot/:id', async(req,res)=>{
      const id=req.params.id;
      const query= { _id: new ObjectId(id)}
      const result=await travelCollection.findOne(query);
      res.send(result);

  })

    app.post('/spot', async (req, res) => {
      const newSpot = req.body;
      console.log(newSpot)
      const result = await travelCollection.insertOne(newSpot);
      res.send(result)
    })


    // user related api
    app.post('/user', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get('/user/:email', async (req, res) => {
      const {email} = req.params;
      const query = { email: email};
      const result = await userCollection.findOne(query);
      res.send(result);
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({
      ping: 1
    });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Travelista server is running')
})


app.listen(port, () => {
  console.log(`Travelista server is running on port: ${port}`)
})