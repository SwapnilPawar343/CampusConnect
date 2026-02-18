import React, {  useEffect } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";

export const studentContext = createContext();

 const StudentContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL||'http://localhost:4000';
    const navigate = useNavigate();
    useEffect(() => {
     const tokent = localStorage.getItem('token');
     if(tokent){
       // console.log("Token found in localStorage:", tokent);
     }else{
        console.log("No token found in localStorage.");
        navigate('/login');
     }}, []);
     
     const [question,setQuestion] = React.useState([]);

     const fetchQuestion = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/questions/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                console.error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
                return;
            }
            
            const data = await response.json();
            console.log("Questions fetched successfully:", data);
            setQuestion(data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
     };

     useEffect(() => {
         fetchQuestion();
     }, [backendUrl]);
    
      
     



    const  value={
        question,
        fetchQuestion

    }

    return (
        <studentContext.Provider value={value}>
            {props.children}
        </studentContext.Provider>
    );
};
export {  StudentContextProvider };