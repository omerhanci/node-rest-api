const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  key: String,
  value: String,
  createdAt: Date,
  counts: Array
})

module.exports = mongoose.model('records', recordSchema)