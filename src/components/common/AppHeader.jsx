import React, { useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useAppTheme } from '../../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import Login from '../../pages/Login';
import { Sidebar } from 'primereact/sidebar';

export default function AppHeader({ onToggleSidebar }) {
    const { user, logout } = useAuth();
    const { cartCount, clearCart, refreshCart } = useCart();
    const { mode, toggleTheme } = useAppTheme();
    const nav = useNavigate();
    const [openLogin, setOpenLogin] = useState(false);

    const handleLogout = () => {
        logout();
        clearCart();
        nav('/');
    };

    const Logo = (
        <div className="flex align-items-center gap-2">
            <Button icon="pi pi-bars" className="p-button-text" onClick={onToggleSidebar} />
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img 
                    src="/logo.png" 
                    alt="E-SHOPPERS" 
                    className="h-2rem md:h-3rem" 
                    style={{ borderRadius: '4px' }}
                    onError={(e) => { 
                        e.target.style.display = 'none'; 
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'block'; 
                    }} 
                />
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: mode === 'light' ? '#0038A8' : '#4169E1', letterSpacing: '-1px', display: 'none' }}>
                    E-SHOPPERS
                </span>
            </Link>
        </div>
    );

    const end = (
        <div className="flex align-items-center gap-2 md:gap-3">
            <IconField iconPosition="left" className="hidden lg:block align-self-center">
                <InputIcon className="pi pi-search" />
                <InputText placeholder="Search products..." className="p-inputtext-sm w-15rem lg:w-25rem" style={{ borderRadius: '4px' }} />
            </IconField>
            
            <Button 
                icon={mode === 'light' ? "pi pi-moon" : "pi pi-sun"} 
                rounded 
                text 
                severity="secondary" 
                onClick={toggleTheme} 
                className="hidden lg:inline-flex"
            />

            {user ? (
                <div className="flex align-items-center gap-2">
                    <div className="text-right mr-2 hidden xl:block">
                        <span className="block text-xs text-color-secondary line-height-1">Hello,</span>
                        <span className="text-sm font-bold" style={{ color: 'var(--text-color)' }}>{user.firstName || 'User'}</span>
                    </div>
                    <Button icon="pi pi-user" rounded text severity="secondary" onClick={() => nav('/profile')} className="hidden lg:inline-flex" />
                    <Button icon="pi pi-power-off" rounded text severity="danger" onClick={handleLogout} className="hidden lg:inline-flex" />
                </div>
            ) : (
                <Button label="Sign In" icon="pi pi-user" severity="secondary" text className="font-bold hidden lg:inline-flex" onClick={() => setOpenLogin(true)} />
            )}

            <Button 
                icon="pi pi-shopping-cart" 
                rounded 
                text 
                severity="secondary" 
                onClick={() => nav('/cart')}
                className="p-overlay-badge"
            >
                {cartCount > 0 && <Badge value={cartCount} severity="danger"></Badge>}
            </Button>
        </div>
    );

    return (
        <div className="card shadow-2 sticky top-0 z-5" style={{ background: 'var(--surface-card)', borderBottom: '1px solid var(--surface-border)' }}>
            <Menubar 
                model={[]} 
                start={Logo} 
                end={end} 
                style={{ border: 'none', background: 'transparent', padding: '0.5rem 1.5rem' }} 
            />
            
            <Sidebar visible={openLogin} onHide={() => setOpenLogin(false)} position="right" className="w-full md:w-30rem" style={{ background: 'var(--surface-card)', color: 'var(--text-color)' }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'var(--text-color)' }}>Welcome Back</Typography>
                <Login 
                    isModal={true} 
                    onSuccess={() => {
                        setOpenLogin(false);
                        refreshCart();
                    }} 
                />
            </Sidebar>
        </div>
    );
}

// Minimal Typography mock to avoid MUI dependency if possible, or just use MUI for now if Typography is still needed elsewhere
function Typography({ children, variant, sx, className, component: Component = 'div', style, ...props }) {
    return <Component className={className} style={{ ...style, ...sx }} {...props}>{children}</Component>;
}
