const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require("bcryptjs")
const cors = require('cors');
require("dotenv").config();
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
JWT_SECRET = "taskmanagement";
//register new user
console.log('Environment Variables:', process.env);

router.post('/register', async (req, res) => {
    try {
        //check user exist
        const userExist = await User.findOne({ email: req.body.email });
        if (userExist) {
            throw new Error("user already exixte");
        }
        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
        //save the user
        const user = new User(req.body);
        await user.save();
        res.send({
            success: true,
            message: "user registered successfully"

        })
    }
    catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
})

//login user
router.post('/login', async (req, res) => {
    try {
        //check if the user exist
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            throw new Error("user does not exist");

        }
        //check if the password is correct
        const passwordcorrect = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!passwordcorrect) {
            throw new Error("invalid password");
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });
        res.send({
            success: true,
            data: token,
            message: "User logged in successfully",
        })

    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
})

//get logged in user
router.get("/get-logged-in-user",authMiddleware, async(req,res)=>{
    try {
        //actual buisness logic
        const user=await User.findOne({_id:req.body.userId});
        //remove the password from user oobject
        user.password=undefined;
        res.send({
            success:true,
            data:user,
            messae:"User fetched successfully",
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
        
    }
})
module.exports = router;