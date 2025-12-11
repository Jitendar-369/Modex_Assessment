import express from 'express';
import { bookAppointment, getMyBookings, cancelBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/', protect, bookAppointment);
router.get('/my-bookings', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);
export default router;
//# sourceMappingURL=bookingRoutes.js.map