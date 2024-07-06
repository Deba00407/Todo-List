import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    isCompleted : Boolean,
    isStarred : Boolean,
    desc : String,
})
const todo = mongoose.model("Todo", todoSchema)
export default todo