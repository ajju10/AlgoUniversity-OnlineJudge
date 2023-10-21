const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongo_url = process.env.MONGO_URL;

const conn = mongoose.connect(mongo_url);

module.exports = { conn };