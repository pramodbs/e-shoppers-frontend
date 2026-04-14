import React, { useState } from 'react';
import AppHeader from '../common/AppHeader';
import AppSidebar from '../common/AppSidebar';
import { Sidebar as PrimeSidebar } from 'primereact/sidebar';
import { useAppTheme } from '../../context/ThemeContext';

export default function MainLayout({ children }) {
    const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);
    const [desktopSidebarVisible, setDesktopSidebarVisible] = useState(false);
    const { mode } = useAppTheme();

    const handleToggle = () => {
        if (window.innerWidth >= 992) {
            setDesktopSidebarVisible(!desktopSidebarVisible);
        } else {
            setMobileSidebarVisible(!mobileSidebarVisible);
        }
    };

    return (
        <div className="min-h-screen flex flex-column" style={{ background: 'var(--surface-bg)', color: 'var(--text-primary)' }}>
            {/* Standard Header */}
            <AppHeader onToggleSidebar={handleToggle} />

            <div className="flex flex-row flex-grow-1 overflow-hidden relative">
                {/* Desktop Sidebar (Toggleable) */}
                {desktopSidebarVisible && (
                    <aside className="hidden lg:block sticky top-0 h-full transition-all duration-300">
                        <AppSidebar />
                    </aside>
                )}

                {/* Mobile/Tablet Sidebar (Overlay) */}
                <PrimeSidebar 
                    visible={mobileSidebarVisible} 
                    onHide={() => setMobileSidebarVisible(false)} 
                    className="p-sidebar-sm"
                    position="left"
                    baseZIndex={1000}
                >
                    <AppSidebar onHide={() => setMobileSidebarVisible(false)} />
                </PrimeSidebar>

                {/* Main Content Area */}
                <main className={`flex-grow-1 p-3 overflow-y-auto transition-all duration-300`}>
                    <div className="container mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
