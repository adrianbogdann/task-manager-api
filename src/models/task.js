const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            trim: true,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            //ref is used to call populate to get all the USER model data
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
)
const Task = mongoose.model('Tasks', taskSchema);

module.exports = Task;