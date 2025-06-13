import { useEffect, useState } from "react";
import axios from "axios";

const AverageRevenue = () => {
  const [averageRevenue, setAverageRevenue] = useState(0);

  useEffect(() => {
    const fetchAverageRevenue = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/revenue/average-revenue");
        setAverageRevenue(response.data.averageRevenue);
      } catch (error) {
        console.error("Error fetching average revenue:", error);
      }
    };

    fetchAverageRevenue();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Average Revenue</h3>
          <p className="text-3xl font-bold">RS. {averageRevenue.toFixed(2)}</p>
        </div>
        <div className="text-4xl opacity-50">
          <i className="fas fa-dollar-sign"></i>
        </div>
      </div>
    </div>
  );
};

export default AverageRevenue;
