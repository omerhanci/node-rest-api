const mongoose = require('mongoose');

// This function should be called only once
function setMongoConnection() {
    // create mongo db connection
    mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true })
        .then(() => {
            console.log('DB connection established')
        })
        .catch(err => {
            console.log('Error occured: ' + err)
        })
}

exports.setMongoConnection = setMongoConnection;