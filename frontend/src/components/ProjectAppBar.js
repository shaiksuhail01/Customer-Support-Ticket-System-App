import React from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Button } from '@mui/material';

import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';






export default function ProjectAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Customer Support Ticket System
          </Typography>
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            <Button color="inherit">New Ticket</Button>
          </Link>
          <Link to="/active" style={{ textDecoration: 'none', color: 'white' }}>
            <Button color="inherit">Active Tickets</Button>
          </Link>
          <Link to="/resolved" style={{ textDecoration: 'none', color: 'white' }}>
            <Button color="inherit">Resolved Tickets</Button>
          </Link>
        
        </Toolbar>
      </AppBar>
    </Box>
  );
}
