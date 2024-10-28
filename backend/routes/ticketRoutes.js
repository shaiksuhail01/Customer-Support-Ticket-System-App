const express = require('express');
const {
    createTicket,
    getActiveTickets,
    resolveTicket,
    getResolvedTickets,
    deleteAllResolvedTickets,
    getAllTickets,
    deleteResolvedTicket,
} = require('../controllers/ticketController');
const router = express.Router();

router.post('/', createTicket);
router.get('/', getActiveTickets);
router.put('/:id', resolveTicket);
router.get('/resolved', getResolvedTickets);
router.delete('/resolved', deleteAllResolvedTickets);
router.get('/all',getAllTickets);
router.delete('/resolved/:id', deleteResolvedTicket);

module.exports = router;
