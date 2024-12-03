import React, { useState } from "react";
import HallForm from "./HallForm";
import HallList from "./HallList";

const MessDetailsPage = () => {
  const [halls, setHalls] = useState([]);
  const [messDetails, setMessDetails] = useState("Mess 1 Details");
  const [showForm, setShowForm] = useState(false);

  const addHall = (newHall) => {
    setHalls([...halls, newHall]);
  };

  const removeHall = (hallName) => {
    setHalls(halls.filter(hall => hall.name !== hallName));
  };

  const handleAddHallClick = () => {
    setShowForm(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Mess Details</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">{messDetails}</h2>
        
        <button 
          onClick={handleAddHallClick} 
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Add Hall
        </button>
      </div>

      {/* Display Add Hall Form */}
      {showForm && <HallForm addHall={addHall} setShowForm={setShowForm} />}

      {/* Hall List */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-700">Halls</h3>
        <HallList halls={halls} removeHall={removeHall} />
      </div>
    </div>
  );
};

export default MessDetailsPage;
