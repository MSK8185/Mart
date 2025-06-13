import React, { useState } from 'react';
import AdminSideBar from '../../Admin/components/AdminSideBar';
import AdminHeader from '../../Admin/components/AdminHeader';

const AdminLayout = ({ children }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex h-screen w-full overflow-x-hidden">
            <AdminSideBar open={open} setOpen={setOpen} />
            <div className="flex flex-1 flex-col overflow-x-hidden">
                <AdminHeader setOpen={setOpen} />
                <main className="flex-1 p-6 bg-gray-100 overflow-y-auto overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
