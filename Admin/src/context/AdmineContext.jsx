import React, { useCallback, useEffect, useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const navigate = useNavigate();

    const [admindata, setAdminData] = useState(null);
    const [alumni, setAlumni] = useState([]);
    const [students, setStudents] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check admin token on mount
    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        const adminUser = localStorage.getItem('adminUser');

        if (!adminToken) {
            console.log("No admin token found. Redirecting to login.");
            navigate('/');
        } else {
            try {
                const userData = JSON.parse(adminUser);
                setAdminData(userData);
                fetchAllData();
            } catch (err) {
                console.error("Error parsing admin user data:", err);
                navigate('/');
            }
        }
    }, []);

    const getToken = useCallback(() => localStorage.getItem('adminToken'), []);

    // Fetch all alumni data
    const fetchAlumni = useCallback(async () => {
        try {
            const response = await fetch(`${backendUrl}/api/admin/alumni`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch alumni: ${response.status}`);
            }

            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching alumni:', error);
            setError(error.message);
            return [];
        }
    }, [backendUrl, getToken]);

    // Fetch all students data
    const fetchStudents = useCallback(async () => {
        try {
            const response = await fetch(`${backendUrl}/api/admin/students`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch students: ${response.status}`);
            }

            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching students:', error);
            setError(error.message);
            return [];
        }
    }, [backendUrl, getToken]);

    // Fetch all events
    const fetchEvents = useCallback(async () => {
        try {
            const response = await fetch(`${backendUrl}/api/events`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch events: ${response.status}`);
            }

            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching events:', error);
            setError(error.message);
            return [];
        }
    }, [backendUrl]);

    // Fetch all questions to calculate alumni stats
    const fetchQuestionsForStats = useCallback(async () => {
        try {
            const response = await fetch(`${backendUrl}/api/questions`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch questions: ${response.status}`);
            }

            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching questions:', error);
            return [];
        }
    }, [backendUrl, getToken]);

    // Calculate alumni stats from questions and answers
    const calculateAlumniStats = useCallback((alumniList, questions) => {
        return alumniList.map(alumnus => {
            let answeredQuestions = 0;
            let likes = 0;
            let dislikes = 0;

            questions.forEach(question => {
                if (question.answers && Array.isArray(question.answers)) {
                    question.answers.forEach(answer => {
                        // Check if alumni answered this question
                        if (answer.answeredBy === alumnus._id || answer.answeredBy === alumnus.id) {
                            answeredQuestions++;
                            // Sum up likes and dislikes from this answer
                            likes += answer.likes || 0;
                            dislikes += answer.dislikes || 0;
                        }
                    });
                }
            });

            return {
                ...alumnus,
                answers: answeredQuestions,
                likes: likes,
                dislikes: dislikes,
                score: answeredQuestions + likes - dislikes
            };
        });
    }, []);

    // Fetch all data
    const fetchAllData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [alumniData, studentsData, eventsData, questionsData] = await Promise.all([
                fetchAlumni(),
                fetchStudents(),
                fetchEvents(),
                fetchQuestionsForStats()
            ]);

            // Calculate stats for alumni
            const alumniWithStats = calculateAlumniStats(alumniData, questionsData);

            setAlumni(alumniWithStats);
            setStudents(studentsData);
            setEvents(eventsData);
        } catch (err) {
            console.error('Error fetching all data:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    }, [fetchAlumni, fetchStudents, fetchEvents, fetchQuestionsForStats, calculateAlumniStats]);

    // Create event
    const createEvent = async (eventData) => {
        try {
            const response = await fetch(`${backendUrl}/api/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(eventData)
            });

            const data = await response.json();
            if (!response.ok) {
                return { success: false, message: data.message || 'Failed to create event' };
            }

            await fetchAllData();
            return { success: true, event: data.event };
        } catch (error) {
            console.error('Error creating event:', error);
            return { success: false, message: 'Failed to create event' };
        }
    };

    // Delete event
    const deleteEvent = async (eventId) => {
        try {
            const response = await fetch(`${backendUrl}/api/admin/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (!response.ok) {
                return { success: false, message: 'Failed to delete event' };
            }

            await fetchAllData();
            return { success: true };
        } catch (error) {
            console.error('Error deleting event:', error);
            return { success: false, message: 'Failed to delete event' };
        }
    };

    // Delete alumni
    const deleteAlumni = async (alumniId) => {
        try {
            const response = await fetch(`${backendUrl}/api/admin/alumni/${alumniId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (!response.ok) {
                return { success: false, message: 'Failed to delete alumni' };
            }

            await fetchAllData();
            return { success: true };
        } catch (error) {
            console.error('Error deleting alumni:', error);
            return { success: false, message: 'Failed to delete alumni' };
        }
    };

    // Delete student
    const deleteStudent = async (studentId) => {
        try {
            const response = await fetch(`${backendUrl}/api/admin/students/${studentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (!response.ok) {
                return { success: false, message: 'Failed to delete student' };
            }

            await fetchAllData();
            return { success: true };
        } catch (error) {
            console.error('Error deleting student:', error);
            return { success: false, message: 'Failed to delete student' };
        }
    };

    const value = {
        admindata,
        alumni,
        students,
        events,
        loading,
        error,
        fetchAllData,
        createEvent,
        deleteEvent,
        deleteAlumni,
        deleteStudent,
        getToken
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
