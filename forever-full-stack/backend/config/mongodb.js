import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("DB Connected");
        });

        mongoose.connection.on('error', (err) => {
            console.error("DB Connection Error:", err);
        });

        await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);

    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }
}

export default connectDB;