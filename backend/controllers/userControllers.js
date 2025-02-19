const asyncHandler = require('express-async-handler');
const User = require("../Models/userModel");
const generateToken = require("../config/generateToken");
const { cookieStorageManager } = require('@chakra-ui/react');

const registerUser =asyncHandler(async (req,res) => {
    const{name,email,password,pic}=req.body;
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please Enter all the Fields");
    }

    const userExists = await User.findOne({email}); //MongoDB query to search if ser exists or not
    if(userExists){
        res.status(400);
        throw new Error("User already exists");
    }
    const user=await User.create({    //Query the database and create a new field for a new
        name, email, password, pic,
    });
    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    }
    else{
        res.status(400);
        throw new Error("Failed to Create new User");
    }
});


const authUser=asyncHandler(async(req,res)=>{
    const { email , password} = req.body;
    const user = await User.findOne({ email });

    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    }
    else{
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});

// /api/user?search=user
const allUsers = asyncHandler(async(req,res)=>{
    const keyword = req.query.search?{
        $or:[
            {name: { $regex: req.query.search, $options: "i"}},
            {email: { $regex: req.query.search, $options: "i"}},
        ]
    }
    :{}; //else dont do anything

    const users =await User.find(keyword).find({_id:{$ne:req.user._id}}); //except the current user return all the users related to this current searched user
    res.send(users);
});

module.exports={registerUser,authUser,allUsers};