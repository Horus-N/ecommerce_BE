
const mongoose = require('mongoose');
const dbConnect = async()=>{
    try {
        await mongoose.connect('mongodb://localhost/digitic');
        console.log('databae Connected Susscessfully');
    } catch (error) {
        console.log('Database error ' + error);
    }
}
module.exports = dbConnect;
