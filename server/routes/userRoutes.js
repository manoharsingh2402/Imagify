import express from 'express'; 
import { registerUser, loginUser, userCredits, paymentRazorpay,verifyPayment} from '../controllers/userController.js';

import userAuth  from '../middlewares/auth.js'; 

const userRouter = express.Router(); 

userRouter.post('/register', registerUser);     
userRouter.post('/login', loginUser); 
userRouter.post('/credits',userAuth ,userCredits);
userRouter.post('/pay-razor',userAuth ,paymentRazorpay);
userRouter.post('/verify-razor',verifyPayment);

export default userRouter; 