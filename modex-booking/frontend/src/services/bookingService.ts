import API from './api';

export const bookAppointment = async (showId: number) => {
    const response = await API.post('/bookings', { showId });
    return response.data;
};

export const confirmBooking = async (bookingId: number) => {
    const response = await API.post(`/bookings/${bookingId}/confirm`);
    return response.data;
};

export const getMyBookings = async () => {
    const response = await API.get('/bookings/my-bookings');
    return response.data;
};

export const cancelBooking = async (id: number) => {
    const response = await API.put(`/bookings/${id}/cancel`);
    return response.data;
};
