const express = require('express')
const app = express();
const cors = require('cors');

require('dotenv').config()

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.obrngag.mongodb.net/?authSource=admin`;

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
   
    const jobCollection = client.db("martialDb").collection("jobs");
    
    //   job route
    app.get('/jobs', async (req, res) => {
        const result = await jobCollection.find().toArray();
       return res.send(result);
      })
    app.post('/jobs', async (req, res) => {
      const jobItem = req.body;
      console.log(jobItem);
      const result = await jobCollection.insertOne(jobItem);
     return res.send(result);
    })
    app.get('/topFresherjobs', async (req, res) => {
      const result = await jobCollection.find({ jobCategory: 'fresher' }).limit(6).toArray();
     return res.send(result);
    })
    
    app.get('/allFresherJob', async (req, res) => {
      const result = await jobCollection.find({ jobCategory: 'fresher' }).toArray();
     return res.send(result);
    })
    app.get('/topExperienceJobs', async (req, res) => {
      const result = await jobCollection.find({ jobCategory: 'experienced' }).limit(6).toArray();
     return res.send(result);
    })
    
    app.get('/allExperienceJobs', async (req, res) => {
      const result = await jobCollection.find({ jobCategory: 'experienced' }).toArray();
     return res.send(result);
    })
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
 return res.send('A to Z is running')
})
app.listen(port, () => {
  console.log(`A to Z is running on port: ${port}`)
})