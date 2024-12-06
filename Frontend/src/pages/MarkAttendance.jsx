import React, { useState } from "react";
import axios from "axios";

const MarkAttendance = ({ messId, studentId }) => {
  const [meal, setMeal] = useState("Breakfast");
  const [responseMessage, setResponseMessage] = useState("");

  const markAttendance = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/attendance/markAttendance`, {
        messId,
        studentId,
        meal,
      });
      setResponseMessage(response.data.message);
    } catch (err) {
      setResponseMessage(err.response?.data?.error || "Error marking attendance.");
    }
  };

  return (
    <div>
      <h1>Mark Attendance</h1>
      <select value={meal} onChange={(e) => setMeal(e.target.value)}>
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
      </select>
      <button onClick={markAttendance}>Mark Attendance</button>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default MarkAttendance;
