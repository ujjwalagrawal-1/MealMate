import React, { useEffect, useState } from "react";
import { useMess } from "../context/MessContext";

const MessPage = () => {
  const { messes, addMess } = useMess();
  const [formData, setFormData] = useState({
    name: "",
    halls: [],
    mealTimes: [],
  });

  const [hall, setHall] = useState({ name: "", capacity: 0 });

  const addHall = () => {
    if (hall.name && hall.capacity) {
      setFormData({
        ...formData,
        halls: [...formData.halls, { ...hall }],
      });
      setHall({ name: "", capacity: 0 }); // Reset hall fields
    } else {
      alert("Please enter both hall name and capacity.");
    }
  };

  const handleMealTimeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const mealTimes = checked
        ? [...prev.mealTimes, value] // Add selected meal time
        : prev.mealTimes.filter((time) => time !== value); // Remove unselected meal time
      return { ...prev, mealTimes };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.halls.length === 0 || formData.mealTimes.length === 0) {
      alert("Please fill out all fields.");
      return;
    }
    await addMess(formData); // Add mess using context function
    setFormData({ name: "", halls: [], mealTimes: [] }); // Reset form
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mess Details</h1>
      
      {/* Form to Add Mess */}
      <form onSubmit={handleSubmit} className="mb-6">
        {/* Mess Name */}
        <div>
          <label className="block font-medium mb-1">Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 w-full"
            placeholder="Enter mess name"
          />
        </div>

        {/* Halls */}
        <div className="mt-4">
          <label className="block font-medium mb-1">Halls:</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={hall.name}
              onChange={(e) => setHall({ ...hall, name: e.target.value })}
              className="border p-2 w-full"
              placeholder="Hall name"
            />
            <input
              type="number"
              value={hall.capacity}
              onChange={(e) => setHall({ ...hall, capacity: e.target.value })}
              className="border p-2 w-full"
              placeholder="Capacity"
            />
            <button
              type="button"
              onClick={addHall}
              className="bg-green-500 text-white px-4 py-2"
            >
              Add Hall
            </button>
          </div>
          <ul className="list-disc pl-5">
            {formData.halls.map((h, index) => (
              <li key={index} className="text-gray-700">
                {h.name} - Capacity: {h.capacity}
              </li>
            ))}
          </ul>
        </div>

        {/* Meal Times */}
        <div className="mt-4">
          <label className="block font-medium mb-1">Meal Times:</label>
          <div className="flex gap-4">
            {["Breakfast", "Lunch", "Dinner"].map((meal) => (
              <label key={meal} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={meal}
                  checked={formData.mealTimes.includes(meal)}
                  onChange={handleMealTimeChange}
                />
                {meal}
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-4">
          Add Mess
        </button>
      </form>

      {/* Mess List */}
      <h2 className="text-xl font-semibold mb-4">Mess List</h2>
      <ul>
        {messes.map((mess) => (
          <li key={mess._id} className="border p-2 mb-2">
            <h3 className="font-bold">{mess.name}</h3>
            <p>Halls:</p>
            <ul className="list-disc pl-5">
              {mess.halls.map((hall, index) => (
                <li key={index}>
                  {hall.name} - Capacity: {hall.capacity}
                </li>
              ))}
            </ul>
            <p>Meal Times: {mess.mealTimes.join(", ")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessPage;












// import React, { useState } from "react";
// import HallForm from "./HallForm";
// import HallList from "./HallList";

// const MessDetailsPage = () => {
//   const [halls, setHalls] = useState([]);
//   const [messDetails, setMessDetails] = useState("Mess 1 Details");
//   const [showForm, setShowForm] = useState(false);

//   const addHall = (newHall) => {
//     setHalls([...halls, newHall]);
//   };

//   const removeHall = (hallName) => {
//     setHalls(halls.filter(hall => hall.name !== hallName));
//   };

//   const handleAddHallClick = () => {
//     setShowForm(true);
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-4">Mess Details</h1>

//       <div className="bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-2xl font-semibold text-gray-700 mb-4">{messDetails}</h2>
        
//         <button 
//           onClick={handleAddHallClick} 
//           className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
//           Add Hall
//         </button>
//       </div>

//       {/* Display Add Hall Form */}
//       {showForm && <HallForm addHall={addHall} setShowForm={setShowForm} />}

//       {/* Hall List */}
//       <div className="mt-6">
//         <h3 className="text-xl font-semibold text-gray-700">Halls</h3>
//         <HallList halls={halls} removeHall={removeHall} />
//       </div>
//     </div>
//   );
// };

// export default MessDetailsPage;
