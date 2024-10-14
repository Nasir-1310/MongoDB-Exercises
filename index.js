const { error } = require("console");
const exp = require("constants");
const express=require("express")
const mongoose = require('mongoose');
const { describe } = require("node:test");
const { type } = require("os");
const { title } = require("process");
var bodyParser = require('body-parser');
const { kMaxLength } = require("buffer");


const app=express();
const port=3002;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({ extended: false }))

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
        required:[true,"produce title missing"],
        minlength:[4,"minimin title need 4"],
        maxlength:[100,"max length 7 must"],
        
        trim: true,// unnecessary space remove kore.
        enum:{
           values:["iphone", "samsung"],
           message:" {VALUE}have no in two limit",
        
    },
    validate:{
        validator: function(v){
            return v.length===7;
        },
        message:(props)=>`${props.value} is not a valid title`
    }
},
    
    price: {
        type:Number,
        required:true,
        min:100,
        max:[400, "Maximum value 400"]
    },
    phone:{
        type:String,
        required:[true,"Phone num required"],

        validate:{
            validator: function(v){
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message:(props)=>`${props.value} is not a valid phone number.`
        }
    },
    description:{
        type:String,
        required:true,
        unique:true,
    },
    rating:Number,
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
        const rating=req.body.rating;
        const phone=req.body.phone;

        const newProduct=new Product({
            title: title,
            price:price,
            description:description,
            rating:rating,
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

app.get("/products",async(req,res)=>{
    try {
        
        const price=req.query.price;
        const rating=req.query.rating;
      
        let products;
        if(price){
             products=await Product.find({ 
                //logical operator and  comparisn query
                $or: [{price:{$lt:price}},{rating:{$lte:rating}}]
             }).sort({price: -1})
        }
        else{
            products=await Product.find().sort({price: -1})
        }
        
        if(products){
            res.status(200).send({
                success:true,
                message: "returned all product",
                data: products
                })
        }
        else{
            res.status(404).send({
                success:false,
                message:"Products not found"
            });
        }
    } catch (error) {
        res.status(500).send({message: error.message});
         }


});

app.get("/products/:id",async(req,res)=>{
    try {
        const id=req.params.id;
        const product=await Product.findOne({_id:id})
      
        if(product){
            res.status(200).send({
            success:true,
            message: "returned single product",
            data: product
            })
            
           
        }
        else{
            res.status(404).send({
                success:false,
                message:"Product not found in this id : "
            });
        }
    } catch (error) {
        res.status(500).send({message: error.message});
         }


});


app.delete("/products/:id",async(req,res)=>{
    try {
        const id=req.params.id;
        const product=await Product.deleteOne({_id:id})
      
        if(product){
            res.status(200).send({
            success:true,
            message: "delete a single product",
            data: product
            })
            
           
        }
        else{
            res.status(404).send({
                success:false,
                message:"Product can not delete"
            });
        }
    } catch (error) {
        res.status(500).send({message: error.message});
         }


});


app.put("/products/:id",async(req,res)=>{
    try {
        const id=req.params.id;
        const updatedProduct=await Product.findByIdAndUpdate(
            {_id:id},
            {
                $set:
                {rating:4.45,},
        })
      
        if(updatedProduct){
            res.status(200).send({
            success:true,
            message: "updated a single product",
            data: updatedProduct
            })
            
           
        }
        else{
            res.status(404).send({
                success:false,
                message:"Product can not update"
            });
        }
    } catch (error) {
        res.status(500).send({message: error.message});
         }


});