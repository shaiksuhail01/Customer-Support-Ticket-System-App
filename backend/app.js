const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const ticketRoutes = require('./routes/ticketRoutes');
const ticketController = require('./controllers/ticketController');

const app = express();
app.use(cors());
app.use(express.json());


connectDB();

// API routes
app.use('/api/tickets', ticketRoutes);
ticketController.initializeTickets();


const PORT =5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
