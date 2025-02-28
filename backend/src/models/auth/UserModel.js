import mongoose from "mongoose";
import bcrypt from "bcrypt";

//how the user will register and what information will be stored 

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please provide name"],
    }, 

    email: {
        type: String,
        required: [true, "please provide email"],
        unique: true,
        trim: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "please provide a valid email"],
    },

    password: {
        type: String,
        required: [true, "please provide password"],
    },

    bio: {
        type: String,
        default: "new user",
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },


    isVerified: {
        type: Boolean,
        default: false,
    },

    }, {timestamps: true, minimize: true}
);

//hash the password before saving 
UserSchema.pre("save", async function (next) {
    
    //firt check if password is not modified
    if (!this.isModified("password")) {
        return next();
    }else{
        //hash the password using bcrypt and generate salt
        const salt = await bcrypt.genSalt(10);

        //hash the password with salt
        const hashedPassword = await bcrypt.hash(this.password, salt);

        //set the password to hashed password
        this.password = hashedPassword;
        
        //call next middleware
        next();
    }
    
});

const User = mongoose.model("User", UserSchema);

export default User;