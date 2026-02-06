import express from "express"
import "dotenv/config"
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoutes.js"
import cors from "cors"

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json())

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://yournotesapp.vercel.app"
    ],
    Credential: true
}))
app.use("/user", userRoute)

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is listening at port ${PORT}`);
})