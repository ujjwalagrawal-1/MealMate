import React from "react";

const HallList = ({ halls, removeHall }) => {
  return (
    <div className="mt-4">
      {halls.length === 0 ? (
        <p className="text-gray-500">No halls added yet.</p>
      ) : (
        <ul className="space-y-4">
          {halls.map((hall) => (
            <li key={hall.name} className="flex items-center justify-between bg-white shadow-sm p-4 rounded-lg">
              <div>
                <p className="font-semibold text-gray-700">{hall.name}</p>
                <p className="text-gray-500">Capacity: {hall.capacity}</p>
              </div>
              <button
                onClick={() => removeHall(hall.name)}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HallList;
