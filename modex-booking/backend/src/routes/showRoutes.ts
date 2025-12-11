import express from 'express';
import { createShow, getAllShows, getShowById, updateShow, deleteShow } from '../controllers/showController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Show:
 *       type: object
 *       required:
 *         - name
 *         - specialty
 *         - start_time
 *         - total_slots
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the show
 *         name:
 *           type: string
 *           description: The name of the doctor or show
 *         specialty:
 *           type: string
 *           description: The specialty of the doctor
 *         start_time:
 *           type: string
 *           format: date-time
 *           description: The start time of the show
 *         total_slots:
 *           type: integer
 *           description: Total number of seats available
 *         available_slots:
 *           type: integer
 *           description: Current number of seats available
 */

/**
 * @swagger
 * tags:
 *   name: Shows
 *   description: The show/doctor management API
 */

/**
 * @swagger
 * /shows:
 *   get:
 *     summary: Returns the list of all shows
 *     tags: [Shows]
 *     responses:
 *       200:
 *         description: The list of the shows
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Show'
 *   post:
 *     summary: Create a new show (Admin only)
 *     tags: [Shows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Show'
 *     responses:
 *       201:
 *         description: The show was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Show'
 *       401:
 *         description: Unauthorized
 */

router.route('/')
    .post(protect, admin, createShow)
    .get(getAllShows);

/**
 * @swagger
 * /shows/{id}:
 *   get:
 *     summary: Get a show by ID
 *     tags: [Shows]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The show ID
 *     responses:
 *       200:
 *         description: The show description
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Show'
 *       404:
 *         description: Show not found
 *   put:
 *     summary: Update a show (Admin only)
 *     tags: [Shows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The show ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Show'
 *     responses:
 *       200:
 *         description: The show was updated
 *   delete:
 *     summary: Delete a show (Admin only, Owner only)
 *     tags: [Shows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The show ID
 *     responses:
 *       200:
 *         description: The show was deleted
 */
router.route('/:id')
    .get(getShowById)
    .put(protect, admin, updateShow)
    .delete(protect, admin, deleteShow);

export default router;
