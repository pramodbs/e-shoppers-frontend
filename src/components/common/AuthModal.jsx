import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, Tabs, Tab, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Login from '../../pages/Login';
import Register from '../../pages/Register';

export default function AuthModal({ open, onClose, defaultTab = 0 }) {
    const [tab, setTab] = useState(defaultTab);

    useEffect(() => {
        if (open) {
            setTab(defaultTab);
        }
    }, [open, defaultTab]);

    const handleSuccess = (user) => {
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth={tab === 0 ? 'xs' : 'md'} fullWidth>
            <Box sx={{ position: 'absolute', right: 8, top: 8, zIndex: 10 }}>
                <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
            </Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', pt: 4 }}>
                <Tabs value={tab} onChange={(e, v) => setTab(v)} centered>
                    <Tab label="Sign In" />
                    <Tab label="Create Account" />
                </Tabs>
            </Box>
            <DialogContent sx={{ p: 0, pb: 2 }}>
                {tab === 0 && <Login isModal onSuccess={handleSuccess} />}
                {tab === 1 && <Register isModal onSuccess={handleSuccess} onSwitchToLogin={() => setTab(0)} />}
            </DialogContent>
        </Dialog>
    );
}
