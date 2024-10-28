const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    ticketNo: { type: String, required: true }, 
    email: { type: String, required: true }, 
    description: { type: String, required: true }, 
    severity: { type: Number, required: true }, 
    createdAt: { type: Date, default: Date.now },
    resolved: { type: Boolean, default: false },
    resolutionDetails: { type: String, default: '' },
});

const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;
