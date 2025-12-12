import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/admin/create-show" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-2 text-blue-600">Create Show</h2>
                    <p className="text-gray-600">Add new doctor schedules and shows.</p>
                </Link>
                <Link to="/admin/shows" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-2 text-blue-600">Manage Shows</h2>
                    <p className="text-gray-600">View, edit, or delete existing shows.</p>
                </Link>
                <Link to="/admin/bookings" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-2 text-blue-600">View Bookings</h2>
                    <p className="text-gray-600">See all bookings and their status.</p>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
