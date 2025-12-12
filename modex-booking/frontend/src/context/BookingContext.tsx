import React, { createContext, useState, ReactNode } from 'react';
import { Show, Booking } from '../types';
import * as showService from '../services/showService';
import * as bookingService from '../services/bookingService';

interface BookingContextType {
    shows: Show[];
    myBookings: Booking[];
    loading: boolean;
    error: string | null;
    fetchShows: () => Promise<void>;
    fetchMyBookings: () => Promise<void>;
    bookAppointment: (showId: number) => Promise<any>;
    confirmBooking: (bookingId: number) => Promise<any>;
    cancelBooking: (bookingId: number) => Promise<void>;
}

export const BookingContext = createContext<BookingContextType>({
    shows: [],
    myBookings: [],
    loading: false,
    error: null,
    fetchShows: async () => { },
    fetchMyBookings: async () => { },
    bookAppointment: async () => { },
    confirmBooking: async () => { },
    cancelBooking: async () => { },
});

export const BookingProvider = ({ children }: { children: ReactNode }) => {
    const [shows, setShows] = useState<Show[]>([]);
    const [myBookings, setMyBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchShows = async () => {
        setLoading(true);
        try {
            const data = await showService.getAllShows();
            setShows(data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch shows');
        } finally {
            setLoading(false);
        }
    };

    const fetchMyBookings = async () => {
        setLoading(true);
        try {
            const data = await bookingService.getMyBookings();
            setMyBookings(data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const bookAppointment = async (showId: number) => {
        setLoading(true);
        try {
            const booking = await bookingService.bookAppointment(showId); // Returns PENDING booking
            await fetchShows();
            await fetchMyBookings();
            setError(null);
            return booking;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Booking failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const confirmBooking = async (bookingId: number) => {
        setLoading(true);
        try {
            const booking = await bookingService.confirmBooking(bookingId);
            try {
                // If this fails (e.g. optimistic concurrency), don't fail the whole action
                await fetchMyBookings();
            } catch (err) {
                console.warn("Failed to refresh bookings after confirmation (non-critical):", err);
            }
            setError(null);
            return booking;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Confirmation failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (bookingId: number) => {
        setLoading(true);
        try {
            await bookingService.cancelBooking(bookingId);
            await fetchShows();
            await fetchMyBookings();
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Cancellation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <BookingContext.Provider
            value={{
                shows,
                myBookings,
                loading,
                error,
                fetchShows,
                fetchMyBookings,
                bookAppointment,
                confirmBooking,
                cancelBooking,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};
