import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import authRoutes from './routes/authRoutes.js';
import showRoutes from './routes/showRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { initSocket } from './config/socket.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger.js';
import './services/cronService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use('/api/auth', authRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => {
    res.send('Modex Booking API is running');
});

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
