const mongoose = require('mongoose');

// This function should be called only once
function setMongoConnection() {
    mongoose.connect("mongodb+srv://challengeUser:WUMglwNBaydH8Yvu@challenge-xzwqd.mongodb.net/getir-case-study?retryWrites=true", { useNewUrlParser: true, useCreateIndex: true })
        .then(() => {
            console.log('DB connection successful')
        })
        .catch(err => {
            console.log('An error occured | ' + err)
        })
}

exports.setMongoConnection = setMongoConnection;