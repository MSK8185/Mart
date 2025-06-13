import { useState } from "react";
import AdminSideBar from "./AdminSideBar";

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex ">
      <AdminSideBar open={isSidebarOpen} setOpen={setSidebarOpen} />
      <main className="flex-1 p-6">Your main content here</main>
    </div>
  );
};

export default Layout;
