const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// main application
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// dotev configuration for Constants
dotenv.config({path : "./config/config.env"});

// all routers
const allRouters = require('./routes/allRouters');

app.use(cors());

// port
const port = process.env.PORT || 8080;

// mongodb database connection
require('./dbconnection')();
app.use(allRouters);

app.listen(port, ()=>{
    console.log("Server listening on port", port);
})