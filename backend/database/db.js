import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/note-app`)
        console.log("Mongodb connected successfully")
    } catch (err) {
        console.log("MongoDB connection error:", err);
    }
}

export default connectDB;