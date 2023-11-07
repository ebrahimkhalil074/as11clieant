const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); 
const express = require('express')
const app = express()
const cors =require("cors")
const port = process.env.PORT|| 3000
  
// MIDDLEWARE
app.use(cors())
app.use(express.json())

// console.log(process.env.DB_USER);

const uri = `mongodb+srv://blog-11:jFCSiUau7HJxHGVC@cluster0.dadactj.mongodb.net/?retryWrites=true&w=majority`;

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
    const blogsCollection =client.db("as_blog").collection("blogs")
    const commentsCollection =client.db("as_blog").collection("comments")
    const wishCollection =client.db("as_blog").collection("wishes")


app.get("/blogs",async(req,res)=>{
  const cursor = blogsCollection.find().sort({ date: -1 });
  const result =await cursor.toArray()
  res.send(result)
})
app.get("/blogs/:id",async(req,res)=>{
  const id =req.params.id
  const query = { _id: new ObjectId(id) };
  const result =await blogsCollection.findOne(query);
  res.send(result)
})

//
app.post('/blogs',async(req,res)=>{
const blog=req.body
console.log(blog);
const result = await blogsCollection.insertOne(blog)
res.send(result)
})
//update blog
app.put('/blogs/:id',async(req,res)=>{
  const id=req.params.id
  const filter =  { _id: new ObjectId(id)}
  const options = { upsert: true };
  const updateBlog =req.body
  const blog = {
    $set: {
      title:updateBlog.title,
      category:updateBlog.category,
      short_dis:updateBlog.short_dis,
      long_dis:updateBlog.long_dis,
      image:updateBlog.image,
      image:updateBlog.image 
    },
  };
  console.log(filter,blog,options);
  const result =await blogsCollection.updateOne(filter,blog,options
    )
  res.send(result)
  })
  


app.post('/comment',async(req,res)=>{
const comment=req.body
console.log(comment);
const result = await commentsCollection.insertOne(comment)
res.send(result)
})

app.get("/comment",async(req,res)=>{
  const cursor = commentsCollection.find();
  const result =await cursor.toArray()
  res.send(result)
})

app.get("/comment/:id",async(req,res)=>{
  const id =req.params.id
  console.log('hhh',id);
  const query = { id: id };
  console.log('ooo',query);
  const result =await commentsCollection.findOne(query);
  res.send(result)
})
//wishes//
app.post('/wishes',async(req,res)=>{
  const blog=req.body
  console.log(blog);
  const result = await wishCollection.insertOne(blog)
  res.send(result)
  console.log(result);
  })
  app.get("/wishes",async(req,res)=>{
    const cursor = wishCollection.find();
    const result =await cursor.toArray()
    res.send(result)
  })

  app.delete("/wishes/:id",async(req,res)=>{
    const id =req.params.id
    console.log(id);
    const query = { _id: id };
    console.log('ooo',query);
    const result =await wishCollection.deleteOne(query);
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
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`BLOG app listening on port ${port}`)
})