import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import ResolvedTicketList from './components/ResolvedTicketList';
import ProjectAppBar from './components/ProjectAppBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
    const [activeTickets, setActiveTickets] = useState([]);
    const [resolvedTickets, setResolvedTickets] = useState([]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/tickets/all');
                setActiveTickets(response.data.activeTickets);
                setResolvedTickets(response.data.resolvedTickets);
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        };

        fetchTickets();
    }, []);

    return (
        <Router>
            <div>
                <ProjectAppBar />
                <div style={{ padding: '16px' }}>
                    <Routes>
                        <Route 
                            path="/" 
                            element={<TicketForm setActiveTickets={setActiveTickets} />} 
                        />
                        <Route 
                            path="/active" 
                            element={<TicketList tickets={activeTickets} setActiveTickets={setActiveTickets} setResolvedTickets={setResolvedTickets} />} 
                        />
                        <Route 
                            path="/resolved" 
                            element={<ResolvedTicketList resolvedTickets={resolvedTickets} setResolvedTickets={setResolvedTickets} />} 
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
