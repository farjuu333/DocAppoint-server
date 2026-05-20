const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);


const express = require('express')
const dotenv= require("dotenv")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config()
const cors = require("cors");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
const app = express()
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8080;



const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const JWKS = createRemoteJWKSet(
new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
)


const verifyToken = async(req,res,next)=>{
  const authHeader = req?.headers.authorization;
  if(!authHeader){
    return res.status(401).json({message : "Unauthorized"});
  }
  const token = authHeader.split(" ")[1]
  if(!token){
    return res.status(401).json({message : "Unauthorized"});
  }

  try {
    const {payload}=await jwtVerify(token,JWKS)
  console.log (payload)
   next()
} catch (error) {
  return res.status(403).json({message:"Forbidden"});
}


}

async function run() {
  try {
   
    // await client.connect();
  

    const db = client.db("docappointdb");
    const doctorsCollection = db.collection("doctors");
    const bookingCollection = db.collection("bookings");





     app.get('/doctor',async(req,res)=>{
      const result =await doctorsCollection.find().toArray()
      res.json(result)
    })

app.get('/doctor', async (req, res) => {
  try {
    // const { search } = req.query;
    const search = req.query.search || req.query.Search || "";
    let query = {};
    if (search) {
      query = {
        name: { $regex: search, $options: "i" } 
      };
    }

    const result = await doctorsCollection.find(query).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

    
    app.get('/top-doctors', async (req, res) => {
      try {
    
        const result = await doctorsCollection.find().sort({ rating: -1 }).limit(3).toArray();
         res.json(result);
      } catch (error) {
          res.status(403).json({ message: "Internal Server Error" });
  }
});

    app.post('/doctor',async(req,res)=>{
        const doctorData = req.body
        console.log(doctorData)
       const result=await doctorsCollection.insertOne(doctorData)
       res.json(result)
    })
     app.get('/doctor/:id',verifyToken,async(req,res)=>{
      const {id}=req.params

      const result = await doctorsCollection.findOne({_id:new ObjectId(id)})
      res.json(result)
    })

    app.get("/booking/:userId",verifyToken,async(req,res)=>{
      const {userId}=req.params
      const result = await bookingCollection.find({userId:userId}).toArray()
      res.json(result)
    })

    app.post('/booking',verifyToken,async(req,res)=>{
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData)
      res.json(result)
    }) 

    app.patch('/booking/:bookingId',verifyToken,async(req,res)=>{
      const {bookingId}=req.params
      const updateData = req.body
      console.log(updateData)
      const result =await bookingCollection.updateOne(
        {_id:new ObjectId(bookingId)},
        {$set:updateData}
      )
      res.json(result)
    })
    

    app.delete('/booking/:bookingId',verifyToken,async(req,res)=>{
      const {bookingId}= req.params
      const result = await bookingCollection.deleteOne({ _id:new ObjectId(bookingId)})
      res.json(result)
    })
// await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('server running fine!')
})

app.listen(port, () => {
  console.log(`server running on port ${port}`)
})
