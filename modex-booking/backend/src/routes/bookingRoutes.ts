import express from 'express';
import { bookAppointment, getMyBookings, cancelBooking, confirmBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, bookAppointment);
router.post('/:id/confirm', protect, confirmBooking);
router.get('/my-bookings', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
