const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id : Number,
    title : String,
    price : Number,
    description : String,
    category : {
        type : String,
        required : true
    },
    image : String,
    sold : Boolean,
    dateOfSale :  String
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;