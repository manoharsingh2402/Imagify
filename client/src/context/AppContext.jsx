// file that stores all functions and states that are used globally in the app, so that we can avoid prop drilling and make our code cleaner and more maintainable.


import {createContext, useState, useEffect} from "react"; 
import {toast} from 'react-toastify'; 
import axios from "axios"; 
import {useNavigate} from "react-router-dom";

export const AppContext = createContext();  

const AppContextProvider = (props) =>{
    const [user, setUser] = useState(false); 
    const [showLogin,setShowLogin] = useState(false);  
    const [token,setToken] = useState(localStorage.getItem('token')); 

    const [credit,setCredit] = useState(0);  

    const navigate = useNavigate(); 
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';  

   const loadCreditsData = async () => {
    try {
        
        const { data } = await axios.post(
            `${backendUrl}/api/user/credits`, 
            {}, 
            { headers: { token } } 
        );

        if (data.success) {
            setCredit(data.credits);
            setUser(data.user);
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || error.message);
    }
   }  

   const generateImage = async (prompt) => {
    try {
        const { data } = await axios.post(
            backendUrl + '/api/image/generate-image',
            { prompt },
            { headers: { token } }
        );  

        if (data.success) {
            loadCreditsData();  
            return data.image;  
        } else {
            toast.error(data.message); 
            loadCreditsData(); 

            if (data.creditBalance === 0) {
                navigate("/buy"); 
            }
        }
    } catch (error) {
        const backendError = error.response?.data;
        toast.error(backendError?.message || error.message);
        if (backendError?.creditBalance === 0) {
            navigate("/buy");
        }
    }
   }

    const logout = ()=>{
        setUser(null); 
        setToken(''); 
        localStorage.removeItem('token'); 
        toast.success("Logged out successfully"); 
    } 

    useEffect(()=>{
        if(token && token !== 'null' && token !== 'undefined'){
            loadCreditsData(); 
        }
    },[token]); 

    const value = {
        user, setUser,
        showLogin, setShowLogin,
        token, setToken,
        credit, setCredit, backendUrl, loadCreditsData, logout, generateImage,
    } 

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
} 

export default AppContextProvider;