const { error } = require("console");
const exp = require("constants");
const express=require("express")
const mongoose = require('mongoose');
const { describe } = require("node:test");
const { type } = require("os");
const { title } = require("process");


const app=express();
const port=3002;
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// mongoose.connect('mongodb://127.0.0.1:27017/testProductDB')
// .then(()=>{
//     console.log("DB is connected");
// })
// .catch((err)=>{
//     console.log("DB is not connected");
//     console.log(error);
//     process.exit(1);
// })

//create product schema
const productSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    
    price: {
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

//create product model
const Product=mongoose.model("Product",productSchema);

const connectDB=async ()=>{
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/testProductDB');
    console.log("DB is connected");
    } catch (error) {
        console.log("DB is not connected");
        console.log(err);
    }

}

app.get("/",(req,res)=>{
    res.send("welcome to home page");

})
app.post("/products",async(req,res)=>{
    try {
        const title=req.body.title;
        const price=req.body.price;
        const description=req.body.description;

        const newProduct=new Product({
            title: title,
            price:price,
            description:description,
        })
        const productData=await newProduct.save();
        
        res.status(201).send(productData);
    } catch (error) {
        res.status(500).send({message: error.message});
    }

})

app.listen(port,async ()=>{

    console.log(`Server running on http://localhost:${port}`)
    await connectDB();
})