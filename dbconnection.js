const mongoose = require('mongoose');

const dbConnect = async ()=>{
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("Database connection established")
    } catch (error) {
        console.log("Error connecting to db : " + error.message);
    }
}

module.exports = dbConnect