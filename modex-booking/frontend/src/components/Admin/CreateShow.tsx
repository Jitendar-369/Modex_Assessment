import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as showService from '../../services/showService';

const CreateShow = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        specialty: '',
        start_time: '',
        end_time: '',
        total_slots: 0,
        duration_minutes: 30,
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await showService.createShow(formData);
            navigate('/admin/shows');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create show');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Create New Show</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="max-w-lg bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Doctor/Show Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Specialty</label>
                    <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Start Time</label>
                    <input type="datetime-local" name="start_time" value={formData.start_time} onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">End Time</label>
                    <input type="datetime-local" name="end_time" value={formData.end_time} onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Total Slots</label>
                    <input type="number" name="total_slots" value={formData.total_slots} onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Duration (minutes)</label>
                    <input type="number" name="duration_minutes" value={formData.duration_minutes} onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create Show</button>
            </form>
        </div>
    );
};

export default CreateShow;
