const router = require('express').Router();

const Task = require('../models/taskModel');
const User = require('../models/userModel');
const Project = require('../models/projectModel');
const authMiddleware = require('../middlewares/authMiddleware');

// Create task
router.post('/create-task', authMiddleware, async (req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        res.status(201).send({
            success: true,
            message: "Task created successfully",
            data: newTask
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

// Get all tasks
router.post('/get-all-tasks', authMiddleware, async (req, res) => { // note the plural form for 'tasks'
    try {
        Object.keys(req.body).forEach((key)=>{
            if(req.body[key]==='all'){
               delete req.body[key];
            }
        });

        delete req.body["userId"]
        console.log(req.body);
        const tasks = await Task.find(req.body).populate("assignedTo").populate("assignedBy").populate("project");
        res.status(200).send({
            success: true,
            message: "Tasks fetched successfully",
            data: tasks  
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});
//update task
router.post("/update-task",authMiddleware,async(req,res)=>{
    try {
        await Task.findByIdAndUpdate(req.body._id,req.body);
        res.send({
            success:true,
            message:"Task updated successfully"
        })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
        
    }
})
//delete task
router.post("/delete-task",authMiddleware,async(req,res)=>{
    try {
        await Task.findByIdAndDelete(req.body._id);
        res.send({
            success:true,
            message:"Task deleted successfully"
        })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
})
module.exports = router;
