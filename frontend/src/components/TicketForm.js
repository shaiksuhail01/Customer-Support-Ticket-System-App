import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  TextField,
  OutlinedInput,
  Button,
  CssBaseline,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Severity mapping
const severityLevels = {
  Low: 3,
  Medium: 2,
  High: 1,
};

const TicketForm = ({ setActiveTickets }) => {
  const [name, setName] = useState('');
  const [ticketNo, setTicketNo] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState(''); 

  const handleSeverityChange = (event) => {
    const {
      target: { value },
    } = event;
    setSeverity(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/tickets', {
        name,
        ticketNo,
        email,
        description,
        severity: severityLevels[severity] || null, 
      });
      const newTicket = response.data;
      setActiveTickets((prevTickets) => {
        const updatedTickets = [...prevTickets, newTicket];
        return updatedTickets.sort((a, b) => a.severity - b.severity);
      });
      setName('');
      setTicketNo('');
      setEmail('');
      setDescription('');
      setSeverity(''); 
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box
          component="form"
          sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <TextField
            id="name"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            id="ticketNo"
            label="Ticket No"
            value={ticketNo}
            onChange={(e) => setTicketNo(e.target.value)}
            required
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            id="description"
            label="Problem Description"
            placeholder="Describe the issue..."
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <FormControl sx={{ m: 1, width: '100%' }}>
            <InputLabel id="severity-label">Severity</InputLabel>
            <Select
              labelId="severity-label"
              id="severity-select"
              value={severity}
              onChange={handleSeverityChange}
              input={<OutlinedInput label="Severity" />}
              MenuProps={MenuProps}
            >
              {Object.keys(severityLevels).map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" type="submit" sx={{ m: 1 }}>
            Create Ticket
          </Button>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default TicketForm;
