import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
    return (
        <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="relative z-10 text-center px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-6xl md:text-8xl font-bold text-gray-900 mb-6 tracking-tight"
                >
                    Book Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                        Perfect Show
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
                >
                    Experience seamless booking with real-time availability.
                    Secure your spot instantly with our premium reservation system.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex justify-center gap-4"
                >
                    <Link
                        to="/shows"
                        className="px-8 py-3 text-lg font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        Browse Shows
                    </Link>
                    <Link
                        to="/register"
                        className="px-8 py-3 text-lg font-semibold text-gray-900 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all hover:scale-105 shadow-sm hover:shadow-md"
                    >
                        Get Started
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default LandingPage;
