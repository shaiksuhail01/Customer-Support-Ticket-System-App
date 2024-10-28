import React, { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ResolvedTicketList = ({ resolvedTickets, setResolvedTickets }) => {
  const [open, setOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);

  const handleOpen = (ticketId) => {
    setSelectedTicketId(ticketId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTicketId(null);
    setDeleteAllOpen(false);
  };

  const deleteTicket = async (ticketId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tickets/resolved/${selectedTicketId}`);
      setResolvedTickets((prevTickets) => prevTickets.filter((ticket) => ticket._id !== ticketId));
      handleClose(); 
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  const deleteAllResolvedTickets = async () => {
    try {
      await axios.delete('http://localhost:5000/api/tickets/resolved');
      setResolvedTickets([]);
    } catch (error) {
      console.error('Error deleting resolved tickets:', error);
    }
    handleClose();
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Resolved Tickets
      </Typography>
      {resolvedTickets.length > 0 && (
        <Button 
          variant="contained" 
          color="error" 
          onClick={() => setDeleteAllOpen(true)} 
          sx={{ marginBottom: 2 }}
        >
          Delete All Resolved Tickets
        </Button>
      )}
      {resolvedTickets.length === 0 ? (
                <Typography variant="h6" align="center">
                    No Resolved Tickets Available
                </Typography>):
                (
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(275px, 1fr))' }}>
        {resolvedTickets.map((ticket) => (
          <Card 
            key={ticket._id} 
            variant="outlined" 
            sx={{ backgroundColor: 'white', color: 'black', border: '1px solid #ccc' }}
          >
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
                Resolved Details: {ticket.resolutionDetails}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Name: {ticket.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {ticket.email}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button 
                size="small" 
                onClick={() => handleOpen(ticket._id)}
                sx={{ 
                  color: 'red',
                  '&:hover': {
                    opacity: 0.9,
                  }
                }}
              >
                <DeleteIcon />
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
                )
      }
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
      >
        <Box sx={{ ...style, width: 300 }}>
          <Typography id="confirmation-modal-title" variant="h6" component="h2">
            Confirm Deletion
          </Typography>
          <Typography id="confirmation-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to delete this ticket?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="contained" color="error" onClick={() => deleteTicket(selectedTicketId)}>Delete</Button>
            <Button variant="contained" onClick={handleClose}>Cancel</Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={deleteAllOpen}
        onClose={handleClose}
        aria-labelledby="delete-all-confirmation-modal-title"
        aria-describedby="delete-all-confirmation-modal-description"
      >
        <Box sx={{ ...style, width: 300 }}>
          <Typography id="delete-all-confirmation-modal-title" variant="h6" component="h2">
            Confirm Deletion of All Resolved Tickets
          </Typography>
          <Typography id="delete-all-confirmation-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to delete all resolved tickets?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="contained" color="error" onClick={deleteAllResolvedTickets}>Delete All</Button>
            <Button variant="contained" onClick={handleClose}>Cancel</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ResolvedTicketList;
