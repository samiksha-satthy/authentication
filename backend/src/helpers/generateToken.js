import jwt from 'jsonwebtoken';

//using the user id to generate token 
const generateToken = (id) => {
    //return token as string
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
}; 

export default generateToken;


