import { useLocation } from "react-router-dom";
import MessQRCode from "../components/MessQRCode";
const MessHomePage = () => {
  // Access the passed mess data from the state
  const { state } = useLocation();
  const { mess } = state || {}; // Destructure mess from state
  console.log(mess)
  if (!mess) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{mess.name} Details</h1>

      {/* Display Hall details */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Halls</h2>
        <ul className="space-y-3">
          {mess.halls.map((hall, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-100"
            >
              <div className="text-gray-800">
                <p className="font-medium">{hall.name}</p>
                <p className="text-sm text-gray-600">
                  Capacity: <span className="font-semibold">{hall.filled}</span>{" "}
                  / {hall.capacity}
                </p>
              </div>
              <MessQRCode hallId={hall._id} />
            </li>
          ))}
        </ul>
      </div>

      {/* Display Meal Times */}
      <div className="mt-4">
        <h2 className="font-semibold">Meal Times:</h2>
        <p>{mess.mealTimes.join(", ")}</p>
      </div>
    </div>
  );
};

export default MessHomePage;
