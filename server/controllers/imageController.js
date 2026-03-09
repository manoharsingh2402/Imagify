import axios from "axios";
import userModel from "../models/userModel.js"; 
import FormData from "form-data"; 

export const generateImage = async (req, res) => {
  try {

    const { userID, prompt } = req.body; 
    
    if (!userID || !prompt) {
 
      return res.status(400).json({ success: false, message: 'Missing Details' });
    } 
    
    const user = await userModel.findById(userID);
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    } 
    
    if (user.creditBalance <= 0) {
      return res.status(400).json({ success: false, message: 'No credits remaining', creditBalance: user.creditBalance });
    }   

    const formData = new FormData();
    formData.append('prompt', prompt);

    const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
        headers: {
            'x-api-key': process.env.CLIPDROP_API, 
            ...formData.getHeaders() 
        },
        responseType: 'arraybuffer'
    });

    const base64Image = Buffer.from(data, 'binary').toString('base64'); 
    const resultImage = `data:image/png;base64,${base64Image}`; 

    await userModel.findByIdAndUpdate(userID, { $inc: { creditBalance: -1 } }); 

    res.json({ success: true, image: resultImage, creditBalance: user.creditBalance - 1 });
     
  } catch (error) {
    console.log(error.message);
  
    if (error.response && error.response.data) {
        console.log("Clipdrop Error:", error.response.data.toString());
    }

    res.status(500).json({ success: false, message: error.message });
  } 
}