import { createContext, useContext, useState, useEffect } from "react";
import toast from 'react-hot-toast';
import axios from 'axios'
export const AuthContext = createContext({});
import { memo } from "react";
export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem('accessToken') || '');
    const [user, setuser] = useState("");
    const [role,setrole] = useState("");
    const [loading, setLoading] = useState(true);
    const storeTokenInLS = (accessToken) => {
        localStorage.setItem('accessToken', accessToken);
        setToken(accessToken);
    }

    let isLoggedIn = !!token;

    
    const logout = () => {
        localStorage.removeItem('accessToken');
        setToken("");
    }
    const userAuthentication = async () => {
        setLoading(true);
        try {
            switch (role) {
                case 'Warden': {
                    const response = await fetchRoleData('http://localhost:3000/api/warden/getwardendata');
                    console.log("Warden-specific data:", response.data);
                    setuser(response.data.data)
                    break;
                }
                case 'Student': {
                    const response = await fetchRoleData('http://localhost:3000/api/student/getstudentdata');
                    console.log("Student-specific data:", response.data);
                    setuser(response.data.data)
                    break;
                }
                case 'MessWorker': {
                    const response = await fetchRoleData('http://localhost:3000/api/messworker/getmessworkerdata');
                    console.log("MessWorker-specific data:", response.data);
                    setuser(response.data.data)
                    break;
                }
                default:
                    console.error("Unknown role:", role);
            }
        } catch (error) {
            console.error("Error in fetching role-specific data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoleData = memo(async (url) => {
        try {
            const response = await axios.get(url, {
                headers: {
                    "x-auth-token": token,
                },
                withCredentials: true,
            });
            return response;
        } catch (error) {
            console.error("Error in API call:", error);
            throw error;
        }
    });
    
    useEffect(() => {
        if (token && role) {
            userAuthentication();
        } else {
            setLoading(false);
        }
    }, [token, role]);
    
    return (
        <AuthContext.Provider value={{ storeTokenInLS, isLoggedIn, logout, user, loading, token }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>{
    return useContext(AuthContext);
}