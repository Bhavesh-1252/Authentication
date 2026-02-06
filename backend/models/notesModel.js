import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    image: {
        name: String,
        contentType: String,
        data: Buffer
    },
    userId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User"
        },

})

export const Notes = mongoose.model("Notes", notesSchema);