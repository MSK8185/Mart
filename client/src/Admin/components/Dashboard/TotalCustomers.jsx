import React, { useEffect, useState } from "react";
import axios from "axios";

const TotalCustomers = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await axios.get(
          "http://20.40.59.234:3000/api/total-users"
        );
        setTotalCustomers(response.data.totalUsers);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    fetchTotalUsers();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Total Customers</h3>
          <p className="text-3xl font-bold">{totalCustomers}</p>
        </div>
        <div className="text-4xl opacity-50">
          <i className="fas fa-users"></i>
        </div>
      </div>
    </div>
  );
};

export default TotalCustomers;
