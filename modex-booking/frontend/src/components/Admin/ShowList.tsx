import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as showService from '../../services/showService';
import { Show } from '../../types';

const ShowList = () => {
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadShows();
    }, []);

    const loadShows = async () => {
        try {
            const data = await showService.getAllShows();
            setShows(data);
        } catch (error) {
            console.error('Failed to load shows', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this show?')) {
            try {
                await showService.deleteShow(id.toString());
                loadShows();
            } catch (error) {
                console.error('Failed to delete show', error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Shows</h1>
                <Link to="/admin/create-show" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add New Show</Link>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Specialty</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Start Time</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Slots</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shows.map((show) => (
                            <tr key={show.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{show.name}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{show.specialty}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(show.start_time).toLocaleString()}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{show.available_slots} / {show.total_slots}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <button onClick={() => handleDelete(show.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShowList;
