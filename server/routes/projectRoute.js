const express = require('express');
const Project = require('../models/projectModel');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require("../models/userModel");
const router = express.Router();


// Create Project
router.post('/create-projects', authMiddleware, async (req, res) => {
  try {
    // const data = req.body;
    const newProject = new Project(req.body);
    await newProject.save();
    res.status(201).send({
      success: true,
      data: newProject,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message,
    });
  }
});

// Get All Projects
router.post('/get-all-projects', authMiddleware, async (req, res) => {
  try {
    const filters = req.body.filters || {};
    const projects = await Project.find(filters || {}).sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      data: projects,
      message: "project created successfully"
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message,
    });
  }
});
//get-project by id for clicking on perticular project
router.post("/get-projects-by-id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.body._id)
      .populate("owner")
      .populate("members.user");
    res.send({
      success: true,
      data: project,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

//adding member in project
router.post("/add-member", authMiddleware, async (req, res) => {
  try {
    const { email, role, projectId } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }
    await Project.findByIdAndUpdate(projectId, {
      $push: {
        members: {
          user: user._id,
          role,
        },
      },
    });

    res.send({
      success: true,
      message: "Member added successfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});


//edit project
router.post("/edit-project", authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndUpdate(req.body._id, req.body);
    res.send({
      success: true,
      message: "Project updated succesfully",
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message,

    })

  }
})
//Delete project
router.post('/delete-project', authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.body._id);
    res.send({
      success: true,
      message: "Project deleted succesfully",
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message,

    })
  }
})
//get project by role
router.post("/get-projects-by-role", authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId;
    const projects = await Project.find({ "members.user": userId })
      .sort({
        createdAt: -1,
      })
      .populate("owner");
    res.send({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});
//delete member
router.post("/remove-member",authMiddleware,async(req,res)=>{
  try {
    const {memberId,projectId}=req.body;
    // await Project.findByIdAndUpdate(projectId,{
    //   $pull:{
    //     members:{
    //       user:userId,
    //     }
    //   }
    // })
    const project=await Project.findById(projectId);
    project.members.pull(memberId);
    res.send({
      success:true,
      message:"Member removed successfully",
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
  });
    
  }
})

module.exports = router;
