import express from 'express';
import { createShow, getAllShows, getShowById, updateShow, deleteShow } from '../controllers/showController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/')
    .post(protect, admin, createShow)
    .get(getAllShows);
router.route('/:id')
    .get(getShowById)
    .put(protect, admin, updateShow)
    .delete(protect, admin, deleteShow);
export default router;
//# sourceMappingURL=showRoutes.js.map