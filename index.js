const mongoose = require("mongoose");
const Initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL ='mongodb://127.0.0.1:27017/Homisphere';

main().then(()=>{
  console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
   await mongoose.connect(MONGO_URL);
}

const initDB = async()=>{
    //first off all clean all the data from database 
    await Listing.deleteMany({});
    //Now insert the data which we have copied from apna college filename
    await Listing.insertMany(Initdata.data);
    console.log("Data was initialized");
};
 // call our function of database 
 initDB();