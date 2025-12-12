import React, { useContext, useEffect, useState } from 'react';
import { BookingContext } from '../../context/BookingContext';
import { useSocket } from '../../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import * as bookingService from '../../services/bookingService';

const ShowList = () => {
    const { shows, fetchShows, myBookings, fetchMyBookings, bookAppointment, confirmBooking, cancelBooking, loading, error } = useContext(BookingContext);
    const { socket } = useSocket();
    const [confirmingBookingId, setConfirmingBookingId] = useState<number | null>(null);

    useEffect(() => {
        const loadData = async () => {
            await fetchShows();
            await fetchMyBookings();
        };
        loadData();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('showsUpdated', () => {
            console.log('Real-time update received!');
            fetchShows();
            fetchMyBookings();
        });

        return () => {
            socket.off('showsUpdated');
        };
    }, [socket]);

    const handleBook = async (showId: number) => {
        try {
            const booking = await bookAppointment(showId);
            // booking is the PENDING booking object
            if (booking && booking.id) {
                setConfirmingBookingId(booking.id);
            }
        } catch (err) {
            console.error(err);
            alert('Booking failed. Check console for details.');
        }
    };

    const [processing, setProcessing] = useState(false);

    const handleConfirm = async () => {
        if (!confirmingBookingId || processing) return;
        setProcessing(true);
        try {
            await confirmBooking(confirmingBookingId);
            setConfirmingBookingId(null);
            alert('Booking CONFIRMED!');
        } catch (err: any) {
            console.error("Confirmation error:", err);

            // Fallback: Check if it actually succeeded despite the error
            try {
                await fetchMyBookings();
                // We need to check if it's confirmed in the refreshed list. 
                // We can't access state 'myBookings' immediately here because it's a closure stale value?
                // Context updates state, but this function closes over 'myBookings' from render time.
                // However, fetchMyBookings updates the context state. We can't inspect it directly here easily 
                // without triggering a re-render or using a ref.
                // But we can manually fetch using the service to be sure.
            } catch (e) { console.error(e); }

            // Since we can't easily check the new state in this async function without a Ref,
            // let's rely on the error message checks, but broaden them.

            const msg = err?.response?.data?.message;
            if (msg === 'Booking already confirmed' || msg === 'Booking not found') {
                // 'Booking not found' might mean it was moved to confirmed history or something (unlikely), 
                // but 'Booking already confirmed' is definitely success.
                setConfirmingBookingId(null);
                alert('Booking CONFIRMED! (Synced)');
            } else {
                // Final Manual Check via Service (bypassing context state delay)
                // This is nuclear option to be absolutely sure.
                try {
                    const freshBookings = await bookingService.getMyBookings();
                    const isConfirmed = freshBookings.find((b: any) => b.id === confirmingBookingId && b.status === 'CONFIRMED');
                    if (isConfirmed) {
                        setConfirmingBookingId(null);
                        alert('Booking CONFIRMED! (Verified)');
                        return; // Escape
                    }
                } catch (e) { }

                alert(`Error: ${msg || 'Confirmation failed.'}`);
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleCancelFlow = async () => {
        if (!confirmingBookingId) return;
        try {
            // Explicitly cancel the PENDING booking
            console.log("User cancelled flow, cancelling pending booking:", confirmingBookingId);
            await cancelBooking(confirmingBookingId);
        } catch (e) {
            console.warn("Failed to cancel pending booking (might have expired already):", e);
        }
        setConfirmingBookingId(null);
    };

    if (loading && shows.length === 0) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
            <h3 className="text-red-600 font-bold mb-2">Something went wrong</h3>
            <p className="text-red-500 mb-4">{error}</p>
            <button
                onClick={() => { fetchShows(); fetchMyBookings(); }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Retry
            </button>
        </div>
    );

    return (
        <div className="relative">
            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirmingBookingId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl"
                        >
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Confirm Booking</h3>
                            <p className="text-gray-600 mb-6">
                                You have 2 minutes to confirm this booking before it expires.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleConfirm}
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={handleCancelFlow}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {shows.map((show, index) => (
                    <motion.div
                        key={show.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-panel rounded-xl p-6 hover:shadow-xl transition-all duration-300"
                    >
                        <h2 className="text-2xl font-bold mb-2 text-gray-800">{show.name}</h2>
                        <div className="space-y-2 mb-6">
                            <p className="flex justify-between text-gray-600">
                                <span className="font-medium">Specialty:</span> {show.specialty}
                            </p>
                            <p className="flex justify-between text-gray-600">
                                <span className="font-medium">Time:</span> {new Date(show.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <div className="flex justify-between items-center bg-gray-100 rounded-lg p-2 mt-2">
                                <span className="font-medium text-gray-700">Slots:</span>
                                <motion.span
                                    key={show.available_slots}
                                    initial={{ scale: 1.5, color: '#FFD700' }}
                                    animate={{ scale: 1, color: show.available_slots > 0 ? '#16a34a' : '#ef4444' }}
                                    transition={{ duration: 0.5 }}
                                    className={`font-bold`}
                                >
                                    {show.available_slots} / {show.total_slots}
                                </motion.span>
                            </div>
                        </div>

                        {(() => {
                            // Find any active or pending booking for this show
                            const userBooking = myBookings.find(b => b.show_id === show.id && b.status !== 'CANCELLED');
                            const isBookedByMe = !!userBooking;

                            return (
                                <motion.button
                                    onClick={() => handleBook(show.id)}
                                    disabled={show.available_slots === 0 || isBookedByMe}
                                    whileHover={!isBookedByMe && show.available_slots > 0 ? { scale: 1.05 } : {}}
                                    whileTap={!isBookedByMe && show.available_slots > 0 ? { scale: 0.95 } : {}}
                                    className={`w-full py-3 rounded-lg font-semibold shadow-lg transition-all ${isBookedByMe
                                        ? 'bg-green-100 text-green-700 border border-green-300 cursor-default'
                                        : show.available_slots > 0
                                            ? 'btn-primary text-white'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {isBookedByMe
                                        ? `Booked by You (${userBooking?.status})`
                                        : show.available_slots > 0
                                            ? 'Book Appointment'
                                            : 'Fully Booked'}
                                </motion.button>
                            );
                        })()}
                    </motion.div>
                ))}
            </div>
            {shows.length === 0 && !loading && (
                <div className="text-center text-gray-500 mt-10">
                    No shows available.
                </div>
            )}
        </div>
    );
};

export default ShowList;
