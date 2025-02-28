import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/auth/UserModel.js';

//checks to see if user is logged in (can only allow certain requests if user is logged in)
export const protect = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json("Not authorized, please login");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        //check if user exists
        if (!user) {
            res.status(404).json("User not found");
        }

        //sey user in request object
        //the user becomes available in the request object
        req.user = user;
        next();
    } catch (error) {

        //if token is not valid 
        res.status(401).json("not authorized, token failed");

        
    }
});


//admin middleware
export const adminMiddleware = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        //if user is an admin, call next middleware or controller 
        next();
        return; 
    }
    //if not admin, send forbidden status and terminate request
    res.status(403).json("only admins are allowed");
});