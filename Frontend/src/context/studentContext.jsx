import React, { useCallback, useEffect } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";

export const studentContext = createContext();

const StudentContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const navigate = useNavigate();

    useEffect(() => {
        const studenttoken = localStorage.getItem('Studenttoken');
        const alumnitoken = localStorage.getItem('Alumnitoken');

        if (!alumnitoken && !studenttoken) { 
            console.log("No student or alumni token found in localStorage.");
            navigate('/login');
        }
        else if (alumnitoken && !studenttoken) {
            console.log("Alumni token found, but no student token. Navigating to alumni dashboard.");
            navigate('/alumni-dashboard');
        }else if (studenttoken && !alumnitoken) {
            navigate('/student-dashboard');
        }
    }, []);

    const [question, setQuestion] = React.useState([]);

    const fetchQuestion = useCallback(async () => {
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
                return false;
            }

            const data = await response.json();
            setQuestion(Array.isArray(data) ? data : []);
            return true;
        } catch (error) {
            console.error('Error fetching questions:', error);
            return false;
        }
    }, [backendUrl]);

    const askQuestion = async ({ title, description }) => {
        try {
            const response = await fetch(`${backendUrl}/api/questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title, description })
            });

            const data = await response.json();
            if (!response.ok) {
                return { success: false, message: data.message || 'Failed to submit question' };
            }

            await fetchQuestion();
            return { success: true };
        } catch (error) {
            console.error('Error submitting question:', error);
            return { success: false, message: 'An error occurred while submitting your question.' };
        }
    };

    const submitAnswer = async ({ quationId, content }) => {
        try {
            const response = await fetch(`${backendUrl}/api/questions/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ quationId, content })
            });

            const data = await response.json();
            if (!response.ok) {
                return { success: false, message: data.message || 'Failed to submit answer' };
            }

            await fetchQuestion();
            return { success: true };
        } catch (error) {
            console.error('Error submitting answer:', error);
            return { success: false, message: 'Failed to submit answer.' };
        }
    };

    const reactToAnswer = async ({ answerId, reaction }) => {
        try {
            const response = await fetch(`${backendUrl}/api/questions/answers/${answerId}/reaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ reaction })
            });

            const data = await response.json();
            if (!response.ok) {
                return { success: false, message: data.message || 'Failed to update reaction' };
            }

            await fetchQuestion();
            return { success: true, data };
        } catch (error) {
            console.error('Error reacting to answer:', error);
            return { success: false, message: 'Failed to update reaction.' };
        }
    };

    useEffect(() => {
        const timerId = setTimeout(() => {
            fetchQuestion();
        }, 0);

        return () => clearTimeout(timerId);
    }, [fetchQuestion]);

    const value = {
        question,
        fetchQuestion,
        askQuestion,
        submitAnswer,
        reactToAnswer
    }

    return (
        <studentContext.Provider value={value}>
            {props.children}
        </studentContext.Provider>
    );
};
export {  StudentContextProvider };