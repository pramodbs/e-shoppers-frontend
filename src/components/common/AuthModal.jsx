import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';
import Login from '../../pages/Login';
import Register from '../../pages/Register';

export default function AuthModal({ open, onClose, defaultTab = 0 }) {
    const [activeIndex, setActiveIndex] = useState(defaultTab);

    useEffect(() => {
        if (open) {
            setActiveIndex(defaultTab);
        }
    }, [open, defaultTab]);

    const handleSuccess = () => {
        onClose();
    };

    return (
        <Dialog 
            visible={open} 
            onHide={onClose} 
            header={null}
            dismissableMask
            closable
            style={{ width: activeIndex === 0 ? '400px' : '800px' }}
            breakpoints={{ '960px': '75vw', '641px': '100vw' }}
        >
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Sign In">
                    <Login isModal onSuccess={handleSuccess} />
                </TabPanel>
                <TabPanel header="Create Account">
                    <Register isModal onSuccess={handleSuccess} onSwitchToLogin={() => setActiveIndex(0)} />
                </TabPanel>
            </TabView>
        </Dialog>
    );
}
