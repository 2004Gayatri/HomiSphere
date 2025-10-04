const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");


//this is used to tell "Please read and understand the data coming from HTML forms ." to express
app.use(express.urlencoded({extended : true}));

app.use(methodOverride("_method"));

const MONGO_URL ='mongodb://127.0.0.1:27017/Homisphere';

main().then(()=>{
  console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});
//mongoose connection
async function main(){
    await mongoose.connect(MONGO_URL);
}

//1st api to test root
app.get("/",(req,res)=>{
  res.send("Hi i am root");
});

app.set("view engine","ejs"); //// using EJS templates
app.set("views", path.join(__dirname, "views"));

//trying the get request
//Index route 
app.get("/listings",async(req,res)=>{
    const allListings = await Listing.find();
    res.render("listings/index",{ listings: allListings }); // // Express will look for due to view engine 'index.ejs' and render it
});

// New route
  app.get("/listings/new",async (req,res)=>{
      res.render("listings/new");
  });

//show route
app.get("/listings/:id",async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show",{listing});

  });

// creating a route for a post request coming from form of new button which is in the file new.ejs
app.post("/listings",(req,res)=>{
  const newlisting = new Listing(req.body.listing);
  newlisting.save();
  res.redirect("/listings");
});

// adding new route for editing request coming from show.ejs
app.get("/listings/:id/edit",async (req,res)=>{
  const {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", {listing});
});

// put request from edit form 
app.put("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.log(err);
    res.send("Error updating listing");
  }
});

// deleting request of POST is coming from show.ejs delete button
app.delete("/listings/:id",async(req,res)=>{
  const { id } = req.params;
  const deleted = await Listing.findByIdAndDelete(id);
  res.redirect(`/listings`);
})


// started and setted our server
app.listen(8080,(req,res)=>{
    console.log("Server is listening to port 8080");
})