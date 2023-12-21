const express = require('express');
const allrouter = express.Router();

const productRouter = require('./product.route');

allrouter.use('/ecomm/api/v1/products', productRouter);

allrouter.use("/ecomm/api/v1/", (req, res) => {
    res.send("Hello this is home page here");
})
module.exports = allrouter
