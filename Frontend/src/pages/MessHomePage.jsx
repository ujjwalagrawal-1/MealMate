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
      <div>
        <h2 className="font-semibold">Halls:</h2>
        <ul className="list-disc pl-5">
          {mess.halls.map((hall, index) => (
            <li key={index}>
              {hall.name} - Capacity: {hall.filled} / {hall.capacity}
            </li>
          ))}
        </ul>
      </div>

      {/* Display Meal Times */}
      <div className="mt-4">
        <h2 className="font-semibold">Meal Times:</h2>
        <p>{mess.mealTimes.join(", ")}</p>
      </div>

      {/* You can add other operations or features here */}
      <MessQRCode messId={mess._id}/>
    </div>
  );
};

export default MessHomePage;
