import React, { useState } from "react";

const HallForm = ({ addHall, setShowForm }) => {
  const [hallName, setHallName] = useState("");
  const [capacity, setCapacity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hallName && capacity) {
      addHall({ name: hallName, capacity });
      setShowForm(false);
    } else {
      alert("Please fill in both fields.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-6 bg-white shadow-lg rounded-lg">
      <div>
        <label htmlFor="hallName" className="block text-sm font-medium text-gray-700">
          Hall Name
        </label>
        <input
          type="text"
          id="hallName"
          className="mt-1 block w-full p-2 border rounded-md"
          value={hallName}
          onChange={(e) => setHallName(e.target.value)}
          required
        />
      </div>

      <div className="mt-4">
        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
          Capacity
        </label>
        <input
          type="number"
          id="capacity"
          className="mt-1 block w-full p-2 border rounded-md"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
        />
      </div>

      <div className="mt-4 flex justify-between">
        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
          Add Hall
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default HallForm;
