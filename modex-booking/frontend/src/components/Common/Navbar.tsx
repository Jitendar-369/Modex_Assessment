import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 glass-panel border-b-0"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                            ModexBooking
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link to={user.role === 'admin' ? "/admin" : "/"} className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                                    Dashboard
                                </Link>
                                {user.role === 'user' && (
                                    <Link to="/my-bookings" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                                        My Bookings
                                    </Link>
                                )}
                                <span className="text-gray-400">|</span>
                                <span className="text-gray-600 font-medium">Hello, {user.email.split('@')[0]}</span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-full border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="px-4 py-2 rounded-full btn-primary text-white font-medium shadow-md hover:shadow-lg">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
