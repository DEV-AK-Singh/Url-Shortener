const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/urlShortener');
        return conn;
    } catch (error) {    
        throw new Error(error);
    }
};

module.exports = connectDB;