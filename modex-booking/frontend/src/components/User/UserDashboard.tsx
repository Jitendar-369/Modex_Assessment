import React from 'react';
import { Link } from 'react-router-dom';
import ShowList from './ShowList';

const UserDashboard = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Available Shows</h1>
                <Link to="/my-bookings" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">My Bookings</Link>
            </div>
            <ShowList />
        </div>
    );
};

export default UserDashboard;
