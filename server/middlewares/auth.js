import jwt from 'jsonwebtoken'; 

const userAuth = (req, res, next) => {
  const {token} = req.headers;  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied!' });
  }
  try {
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if(tokenDecoded.id) {
        req.body.userID = tokenDecoded.id; 
    } 
    else{
        return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
    }
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export default userAuth;