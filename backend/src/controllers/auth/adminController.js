import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModel.js";

export const deleteUser = asyncHandler(async (req, res) => {
    const {id} = req.params;

    //try to find user by id and delete
    try {
        const user = await User.findByIdAndDelete(id);

        //check if user exists
        if (!user) {
            res.status(404).json("User not found"); 
        }

        //delete user
        res.status(200).json("User deleted successfully");
        }

    catch (error) {
        res.status(500).json("cannot delete user");
    }
});