import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { dashboardData } from '../../data';
import AverageRevenue from '../components/Dashboard/AverageRevenue';
import TotalOrders from '../components/Dashboard/TotalOrders';
import TotalCustomers from '../components/Dashboard/TotalCustomers';
import LowStockProducts from '../components/LowStockProducts';
import RevenueVsOrdersChart from '../components/Dashboard/RevenueVsOrdersChart';


const Dashboard = () => {
  const dashboardRef = useRef(null);
  const cardsRef = useRef([]);
  const tableRef = useRef(null);

  const [loading, setLoading] = useState(true);





  useEffect(() => {
    cardsRef.current = cardsRef.current.slice(0, 4);
  }, []);

  useEffect(() => {
    if (dashboardRef.current) {
      gsap.fromTo(
        dashboardRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
    }

    if (cardsRef.current.every(ref => ref !== null)) {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          delay: 0.2,
          ease: 'power2.out',
        }
      );
    }

    if (tableRef.current) {
      gsap.fromTo(
        tableRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.5,
          ease: 'power2.out',
        }
      );
    }
  }, []);


  return (
    <div
      ref={dashboardRef}
      className="p-6 bg-gray-100 min-h-screen font-poppins opacity-100 transition-opacity duration-300"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome Back, Admin</h2>
      <p className="text-gray-500 mb-8">Be Happy, welcome back Admin</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[<AverageRevenue />, <TotalOrders />, <TotalCustomers />, <LowStockProducts />].map((Component, i) => (
          <div key={i} ref={(el) => (cardsRef.current[i] = el)} className="opacity-100 transition-opacity duration-300">
            {Component}
          </div>
        ))}
      </div>

      <RevenueVsOrdersChart />

      <div
        ref={tableRef}
        className="p-6 bg-white rounded-lg shadow-md mb-8 opacity-100 transition-opacity duration-300"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h3>
        <table className="w-full text-left table-auto border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-2 px-4 text-gray-500 font-medium">Order ID</th>
              <th className="py-2 px-4 text-gray-500 font-medium">Customer</th>
              <th className="py-2 px-4 text-gray-500 font-medium">Order Date</th>
              <th className="py-2 px-4 text-gray-500 font-medium">Status</th>
              <th className="py-2 px-4 text-gray-500 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.recentOrders?.map((order) => (
              <tr key={order.id} className="hover:bg-gray-100 transition-colors">
                <td className="py-3 px-4 text-gray-700">{order.id}</td>
                <td className="py-3 px-4 text-gray-700">{order.customer}</td>
                <td className="py-3 px-4 text-gray-700">{order.date}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 text-sm font-semibold rounded-full 
                    ${order.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-700 font-semibold">Rs.{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
