import React, { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    width: 400,
};

const TicketList = ({ tickets, setActiveTickets, setResolvedTickets }) => {
    const [open, setOpen] = useState(false);
    const [resolutionDetails, setResolutionDetails] = useState('');
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [severityFilter, setSeverityFilter] = useState('All');

    const handleOpen = (id) => {
        setSelectedTicketId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setResolutionDetails('');
        setSelectedTicketId(null);
    };

    const resolveTicket = async () => {
        if (resolutionDetails) {
            try {
                const response = await axios.put(`http://localhost:5000/api/tickets/${selectedTicketId}`, { resolutionDetails });
                const resolvedTicket = response.data;

                setResolvedTickets(prevResolved => [...prevResolved, resolvedTicket]);

                setActiveTickets(prevTickets => {
                    const updatedTickets = prevTickets.filter(ticket => ticket._id !== selectedTicketId);
                    return updatedTickets.sort((a, b) => a.severity - b.severity);
                });
            } catch (error) {
                console.error('Error resolving ticket:', error);
            }
            handleClose(); 
        }
    };

    // Filter tickets based on severity
    const filteredTickets = severityFilter === 'All' 
        ? tickets 
        : tickets.filter(ticket => ticket.severity === Number(severityFilter));

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Active Tickets
            </Typography>

            <FormControl  variant="outlined" sx={{ mb: 2,minWidth: 230 }}>
                <InputLabel id="severity-filter-label">Filter by Severity</InputLabel>
                <Select
                    labelId="severity-filter-label"
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    label="Filter by Severity"
                >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="1">Severity 1</MenuItem>
                    <MenuItem value="2">Severity 2</MenuItem>
                    <MenuItem value="3">Severity 3</MenuItem>
                </Select>
            </FormControl>

            {filteredTickets.length === 0 ? (
                <Typography variant="h6" align="center">
                    No Active Tickets Available
                </Typography>
            ) : (
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(275px, 1fr))' }}>
                    {filteredTickets.map(ticket => (
                        <Card key={ticket._id} variant="outlined">
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Ticket Number: {ticket.ticketNo}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Description: {ticket.description}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Severity: {ticket.severity}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Name: {ticket.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Email: {ticket.email}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    onClick={() => handleOpen(ticket._id)}
                                    sx={{
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontWeight: '600',
                                        '&:hover': { opacity: 0.9 }
                                    }}
                                >
                                    Resolve
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            )}

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="resolution-modal-title"
                aria-describedby="resolution-modal-description"
            >
                <Box sx={style}>
                    <Typography id="resolution-modal-title" variant="h6" component="h2">
                        Enter Resolution Details
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        margin="normal"
                        label="Resolution Details"
                        value={resolutionDetails}
                        onChange={(e) => setResolutionDetails(e.target.value)}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={resolveTicket}>
                            Submit
                        </Button>
                        <Button variant="outlined" onClick={handleClose}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default TicketList;
