const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');
const LinkedList = require('../dataStructures/LinkedList');
const PriorityQueue = require('../dataStructures/PriorityQueue');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure nodemailer

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider
    auth: {
        user: process.env.EMAIL_USER, // Access email from environment variable
        pass: process.env.EMAIL_PASS  // Access password from environment variable
    }
});


const resolvedTickets = new LinkedList();
const activeTicketsQueue = new PriorityQueue();



const sendEmailNotification = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Replace with your email
        to,
        subject,
        text
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


// Fetch and populate active tickets from the database
const populateActiveTickets = async () => {
    const tickets = await Ticket.find({ resolved: false }).sort({ severity: 1 });
    tickets.forEach(ticket => activeTicketsQueue.enqueue(ticket));
};

// Fetch and populate resolved tickets from the database
const populateResolvedTickets = async () => {
    const tickets = await Ticket.find({ resolved: true });
    tickets.forEach(ticket => resolvedTickets.add(ticket));
};

// Initialize the tickets when the server starts
exports.initializeTickets = async () => {
    await populateActiveTickets();
    await populateResolvedTickets();
};

// Create a new ticket
exports.createTicket = async (req, res) => {
    const { name, ticketNo, email, description, severity } = req.body;

    if (!name || !ticketNo || !email || !description || severity === undefined) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const ticket = new Ticket({ name, ticketNo, email, description, severity });
    await ticket.save();
    activeTicketsQueue.enqueue(ticket);
    
    // Send notification email
    const subject = `Ticket Created: ${ticketNo}`;
    const text = `Hello ${name},\n\nYour ticket has been created successfully with the following details:\n\nTicket No: ${ticketNo}\nDescription: ${description}\nSeverity: ${severity}\nTicket ID: ${ticket._id}\n\nThank you!`;
    await sendEmailNotification(email, subject, text);

    res.status(201).json(ticket);
};


// Get all active tickets (not resolved)
exports.getActiveTickets = (req, res) => {
    const tickets = activeTicketsQueue.getAll();
    res.json(tickets);
};

// Resolve a ticket
exports.resolveTicket = async (req, res) => {
    const ticketId = req.params.id;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
    }

    const resolutionDetails = req.body.resolutionDetails;
    ticket.resolved = true;
    ticket.resolutionDetails = resolutionDetails;
    await ticket.save();

    const newResolvedTicket = {
        name: ticket.name,
        ticketNo: ticket.ticketNo,
        email: ticket.email,
        description: ticket.description,
        severity: ticket.severity,
        createdAt: ticket.createdAt,
        resolutionDetails: ticket.resolutionDetails,
    };

    resolvedTickets.add(newResolvedTicket);
    activeTicketsQueue.dequeue(); // Remove the resolved ticket from the queue

    // Send resolution email
    const subject = `Ticket Resolved: ${ticket.ticketNo}`;
    const text = `Hello ${ticket.name},\n\nYour ticket has been resolved with the following details:\n\nTicket No: ${ticket.ticketNo}\nDescription: ${ticket.description}\nResolution: ${resolutionDetails}\nTicket ID: ${ticket._id}\n\nThank you!`;
    await sendEmailNotification(ticket.email, subject, text);

    res.json(ticket);
};

// Get all resolved tickets
exports.getResolvedTickets = (req, res) => {
    const tickets = resolvedTickets.display();
    res.json(tickets);
};

// Delete all resolved tickets
exports.deleteAllResolvedTickets = async (req, res) => {
    resolvedTickets.clear();
    await Ticket.deleteMany({ resolved: true });
    res.status(204).send();
};

// Get all tickets (active and resolved)
exports.getAllTickets = async (req, res) => {
    try {
        const activeTickets = activeTicketsQueue.getAll();
        const resolvedTicketsData = resolvedTickets.display();
        res.json({ activeTickets, resolvedTickets: resolvedTicketsData });
    } catch (error) {
        console.error('Error retrieving all tickets:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//delete resolved ticket
exports.deleteResolvedTicket = async (req, res) => {
    const ticketId = req.params.id;

    try {
        await resolvedTickets.delete(ticketId);
        await Ticket.findByIdAndDelete(ticketId);

        res.status(204).send(); 
    } catch (error) {
        console.error('Error deleting resolved ticket:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};