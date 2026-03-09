import mongoose from 'mongoose'; 
import dotenv from 'dotenv'; 
dotenv.config(); 

const connectDB = async () => {
    try { 

        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        }); 

        await mongoose.connect(`${process.env.MONGO_URL}/imagify`);   

        
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); 
    }
}; 

export default connectDB; 