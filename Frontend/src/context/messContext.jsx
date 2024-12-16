import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const MessContext = createContext();

export const MessProvider = ({ children }) => {
  const [messes, setMesses] = useState([]);

  useEffect(() => {
    const fetchMesses = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/mess/getMess`, {
          headers: {
            "x-auth-token": localStorage.getItem("authToken"),
          },
        });
        if (res.data.success) {
          console.log("mes context", res.data.messes);
          setMesses(res.data.messes);
        } else {
          console.error("Failed to fetch messes:", res.data.message);
          // alert(`Error: ${res.data.message || "Failed to fetch messes"}`);
        }
      } catch (err) {
        console.error("Error fetching messes:", err);
        // alert("An error occurred while fetching messes. Please try again.");
      }
    };
    fetchMesses();
  }, []);

  const addMess = async (newMess) => {
    try {
      const res = await axios.post(`${apiUrl}/api/mess/create`, newMess, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("authToken"),
        },
      });
  
      if (res.data.success) {
        setMesses((prevMesses) => [...prevMesses, newMess]); // Append newMess
        alert("Mess added successfully!");
      } else {
        console.error("Failed to add mess:", res.data.message);
        alert(`Error: ${res.data.message || "Failed to add mess"}`);
      }
    } catch (err) {
      console.error("Error adding mess:", err);
      alert("An error occurred while adding the mess. Please try again.");
    }
  };
  

  return (
    <MessContext.Provider value={{ messes, addMess }}>
      {children}
    </MessContext.Provider>
  );
};

export const useMess = () => useContext(MessContext);
