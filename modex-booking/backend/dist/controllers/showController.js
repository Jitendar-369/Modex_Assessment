import pool from '../config/database.js';
export const createShow = async (req, res) => {
    const { name, specialty, start_time, end_time, total_slots, duration_minutes } = req.body;
    try {
        const newShow = await pool.query('INSERT INTO shows (name, specialty, start_time, end_time, total_slots, available_slots, duration_minutes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [name, specialty, start_time, end_time, total_slots, total_slots, duration_minutes]);
        res.status(201).json(newShow.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
export const getAllShows = async (req, res) => {
    try {
        const shows = await pool.query('SELECT * FROM shows ORDER BY start_time ASC');
        res.json(shows.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
export const getShowById = async (req, res) => {
    const { id } = req.params;
    try {
        const show = await pool.query('SELECT * FROM shows WHERE id = $1', [id]);
        if (show.rows.length === 0) {
            return res.status(404).json({ message: 'Show not found' });
        }
        res.json(show.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
export const updateShow = async (req, res) => {
    const { id } = req.params;
    const { name, specialty, start_time, end_time, total_slots, duration_minutes } = req.body;
    try {
        const updatedShow = await pool.query('UPDATE shows SET name = $1, specialty = $2, start_time = $3, end_time = $4, total_slots = $5, duration_minutes = $6 WHERE id = $7 RETURNING *', [name, specialty, start_time, end_time, total_slots, duration_minutes, id]);
        if (updatedShow.rows.length === 0) {
            return res.status(404).json({ message: 'Show not found' });
        }
        res.json(updatedShow.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
export const deleteShow = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedShow = await pool.query('DELETE FROM shows WHERE id = $1 RETURNING *', [id]);
        if (deletedShow.rows.length === 0) {
            return res.status(404).json({ message: 'Show not found' });
        }
        res.json({ message: 'Show deleted' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
//# sourceMappingURL=showController.js.map