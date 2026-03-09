import bcrypt from 'bcrypt'; 
import userModel from '../models/userModel.js'; 
import jwt from 'jsonwebtoken';  
import razorpay from 'razorpay';  
import transactionModel from '../models/transactionModel.js';

export const registerUser = async (req, res) => {
  try {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Missing Details' });
        } 

        const existingUser = await userModel.findOne({email});  

        if(existingUser){
            return res.status(400).json({success:false,message:"Email is already taken."}); 
        }

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt); 

        const newUser = new userModel({ name, email, password: hashedPassword }); 
         
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); 

        res.json({ success: true, token, user: {name: user.name} }); 

  }catch(error){
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
  }

}; 

export const loginUser = async (req, res) => {
  try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ success: false, message: 'Missing Details' });
        } 
        const user = await userModel.findOne({ email }); 
        if(!user) {
            return res.status(400).json({ success: false, message: "User with given email doesn't exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password); 
        if(!isMatch) {
            return res.status(400).json({ success: false, message: 'Wrong Password' });
        }   
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); 
        res.json({ success: true, token, user: { name: user.name } }); 
  } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
  }
}; 

export const userCredits = async (req, res) => {
  try {
        const {userID} = req.body;  
        // userID in the body is passed by middleware after verifying the JWT token, so we can trust it.
        const user = await userModel.findById(userID); 
        if(!user) {
            return res.status(400).json({ success: false, message: "User doesn't exist" });
        }   
        res.json({ success: true, credits: user.creditBalance,user: {name: user.name} }); 
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};   

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
}); 

export const paymentRazorpay = async (req, res) => {
    try {
        const { userID, planId } = req.body; 

        if (!userID || !planId) {
            return res.status(400).json({ success: false, message: 'Missing Details' });
        } 

        const user = await userModel.findById(userID); 
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        let credits, plan, amount, date = Date.now(); 

        switch (planId) {
            case 'Basic': 
                plan = 'Basic'; 
                credits = 5; 
                amount = 5; 
                break; 
            case 'Advanced': 
                plan = 'Advanced'; 
                credits = 15; 
                amount = 10; 
                break; 
            case 'Business': 
                plan = 'Business'; 
                credits = 35; 
                amount = 25; 
                break; 
            default: 
                return res.status(400).json({ success: false, message: "Plan not found" }); 
        } 
        
        const transactionData = {
            userID, plan, amount, credits, date
        } 
        
        const newTransaction = await transactionModel.create(transactionData); 

        const options = {
            amount: amount * 100, // Razorpay expects amount in the smallest currency unit (e.g., paise/cents)
            currency: process.env.CURRENCY,
            receipt: newTransaction._id.toString(),
        }
        
        // 3. FIXED: Removed the callback and just used 'await' to get the order cleanly
        const order = await razorpayInstance.orders.create(options);
        
        res.json({ success: true, order }); 

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
} 

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body; 

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id); 

        if (orderInfo.status === 'paid') {
            const transactionData = await transactionModel.findById(orderInfo.receipt); 
            
            // Note: Double check if your model uses 'payment' or 'verifyPayment' for the boolean flag
            if (transactionData.payment) {
                return res.json({ success: false, message: 'Payment already verified' }); 
            } 

            const user = await userModel.findById(transactionData.userID); 
            const newCreditBalance = transactionData.credits + user.creditBalance; 
            
            await userModel.findByIdAndUpdate(user._id, { creditBalance: newCreditBalance }); 
            await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true });  

            res.json({ success: true, message: 'Payment Successful & Credits Added!' }); 
        } else {
            res.json({ success: false, message: 'Payment Failed' }); 
        } 
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message }); 
    }
}