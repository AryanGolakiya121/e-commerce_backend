const mongoose = require('mongoose')

const dbConfig = mongoose
    .connect(process.env.MONGODB_URI, {})
    .then(() => {
        console.log('Connected to database successfully');
    }).catch(err => {
        console.log('Database connection error: ',err);
    })    
    
module.exports = dbConfig