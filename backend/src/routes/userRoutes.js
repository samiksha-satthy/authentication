import express from 'express';
import { registerUser, 
    loginUser, 
    logoutUser, 
    getUser, 
    updateUser,
    userLoginStatus,
} from '../controllers/auth/userController.js';
import { adminMiddleware, protect } from '../middleware/authMiddleware.js';
import { deleteUser } from '../controllers/auth/adminController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get ('/logout', logoutUser);
router.get('/profile', protect, getUser); 
router.patch('/update', protect, updateUser);

//admin routes 
router.delete('/admin/users/:id', protect, adminMiddleware, deleteUser);

//login status
router.get('/login-status', userLoginStatus);



export default router;