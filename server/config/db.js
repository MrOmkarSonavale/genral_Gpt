import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });

        const conn = await mongoose.connect(`${process.env.MONGO_URL}/quickgpt`);


    } catch (err) {
        console.error("MongoDB Error:", err.message);
        process.exit(1);
    }
};

export default connectDB;