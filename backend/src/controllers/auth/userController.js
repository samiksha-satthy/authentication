import asyncHandler from 'express-async-handler';
import User from '../../models/auth/UserModel.js';
import generateToken from '../../helpers/generateToken.js';
import bcrypt from 'bcrypt';
import { response } from 'express';
import jwt from 'jsonwebtoken';
import Token from '../../models/auth/token.js';
import crypto, { hash } from 'node:crypto';
import hashToken from '../../helpers/hashToken.js';

//user register 
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    //validate - send bad request if any field is missing
    if (!name || !email || !password) {
        res.status(400).json("Please provide all fields");
    }

    //check password length
    if (password.length < 6) {
        res.status(400).json("Password must be at least 6 characters");
    }

    //check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists){
        return res.status(400).json("User already exists");
    }

    //create new user
    const user = await User.create({
        name,
        email,
        password,
    });

    //generate token using user id
    const token = generateToken(user._id);

    //send back the user and token in the response
    res.cookie('token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: true,
        secure: true,
    });

    console.log(token);

    //sends response if user is created and sends error response if user not created 
    if(user){
        const { _id, name, email, role, bio, isVerified } = user;

        res.status(201).json({
            _id,
            name,
            email,
            role,
            bio, 
            isVerified, 
            token,
        });
    }else{
        res.status(400).json("Invalid user data");
    }


});


//user login
export const loginUser = asyncHandler(async (req, res) => {
    
    //get email and password
    const { email, password } = req.body;

    //validate 
    if (!email || !password) {
        res.status(400).json("Please provide both fields");

    }

    //check if user exists
    const userExists = await User.findOne({ email });
    if (!userExists) {
        return res.status(400).json("user not found; please register");
    }

    //check if password matches in database
    const isMatch = await bcrypt.compare(password, userExists.password);

    if (!isMatch) {
        return res.status(400).json("Invalid credentials");
    }

    //generate token
    const token = generateToken(userExists._id);
    if (userExists && isMatch){
        const { _id, name, email, role, bio, isVerified } = userExists;

        //set token in cookie
        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            sameSite: true,
            secure: true,
    });

    //send back the user and token to client
    res.status(200).json({
        _id,
        name,
        email,
        role,
        bio,
        isVerified,
        token,
    });
}else{
    res.status(400).json("Invalid credentials");
}

});

//logout user 
export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('token');
    res.status(200).json("User logged out");
    });


//get user 
export const getUser = asyncHandler(async (req, res) => {
    //get user details from token
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
        //sends information of user if user is found
        res.status(200).json(user);
    }else{
        //sends error response if user is not found
        res.status(404).json("User not found");
    }

});

//update user
export const updateUser = asyncHandler(async (req, res) => {
    //get user details from the token 
    const user = await User.findById(req.user._id);

    if(user){
        //these details will uopdate
        const {name, bio, password, email} = req.body; 

        //update user properties 
        user.name = req.body.name || user.name;
        user.bio = req.body.bio || user.bio;
        user.password = req.body.password || user.password;
        user.email = req.body.email || user.email;

        const updated = await user.save();

        res.status(200).json({
            _id: updated._id,
            name: updated.name,
            email: updated.email,
            password: updated.password,
            role: updated.role,
            bio: updated.bio,
            isVerified: updated.isVerified,
        });

    }else{
        res.status(404).json("User not found");
    }

});

//login status 
export const userLoginStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json("not authorized, please login");
    }
    //verify token 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
        res.status(200).json(true);
    }else{
        res.status(401).json(false);
    }
});

    
