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
import { Sidebar } from 'primereact/sidebar';
import { useNavigate, Link } from 'react-router-dom';
import Login from '../../pages/Login';
import Register from '../../pages/Register';
import SearchService from '../../services/SearchService';
import { OverlayPanel } from 'primereact/overlaypanel';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function AppHeader({ onToggleSidebar }) {
    const { user, logout } = useAuth();
    const { cartCount, clearCart, refreshCart, syncCart } = useCart();
    const { mode, toggleTheme } = useAppTheme();
    const nav = useNavigate();
    const [openLogin, setOpenLogin] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({ products: [], categories: [] });
    const [isSearching, setIsSearching] = useState(false);
    const op = React.useRef(null);

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery.trim().length > 1) {
                performSearch(searchQuery);
            } else {
                setSearchResults({ products: [], categories: [] });
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const performSearch = async (q) => {
        setIsSearching(true);
        try {
            const [prods, cats] = await Promise.all([
                SearchService.searchProducts(q),
                SearchService.searchCategories(q)
            ]);
            setSearchResults({ products: prods || [], categories: cats || [] });
        } catch (err) {
            console.error("Search failed", err);
        } finally {
            setIsSearching(false);
        }
    };

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
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--royal)', letterSpacing: '-1px', display: 'none' }}>
                    E-SHOPPERS
                </span>
            </Link>
        </div>
    );

    const end = (
        <div className="flex align-items-center gap-2 md:gap-3">
            <IconField iconPosition="left" className="hidden lg:block align-self-center">
                <InputIcon className="pi pi-search" />
                <InputText 
                    placeholder="Search products or categories..." 
                    className="p-inputtext-sm w-15rem lg:w-25rem" 
                    style={{ borderRadius: '20px' }} 
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value.trim().length > 1) {
                            op.current.show(e);
                        } else {
                            op.current.hide();
                        }
                    }}
                    onFocus={(e) => {
                        if (searchQuery.trim().length > 1) op.current.show(e);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchQuery.trim().length > 0) {
                            nav(`/search?q=${encodeURIComponent(searchQuery)}`);
                            op.current.hide();
                        }
                    }}
                />
            </IconField>
            
            <OverlayPanel ref={op} className="w-25rem shadow-4 border-round-xl p-0 overflow-hidden" style={{ top: '65px !important' }}>
                <div className="p-3 bg-primary text-white flex justify-content-between align-items-center">
                   <span className="font-bold"><i className="pi pi-search mr-2 text-sm"></i>Search Results</span>
                   {isSearching && <i className="pi pi-spin pi-spinner text-sm"></i>}
                </div>
                <div className="max-h-25rem overflow-y-auto">
                    {searchResults.categories.length > 0 && (
                        <div className="p-2 border-bottom-1 surface-border">
                            <span className="text-xs text-secondary font-bold px-2 mb-2 block uppercase">Categories</span>
                            {searchResults.categories.slice(0, 5).map(cat => (
                                <div 
                                    key={cat.id} 
                                    className="p-2 hover:surface-hover cursor-pointer border-round transition-colors"
                                    onClick={() => { nav(`/search?q=${encodeURIComponent(cat.title)}`); op.current.hide(); }}
                                >
                                    <i className="pi pi-tag mr-2 text-primary"></i>
                                    <span>{cat.title}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {searchResults.products.length > 0 && (
                        <div className="p-2">
                            <span className="text-xs text-secondary font-bold px-2 mb-2 block uppercase">Products</span>
                            {searchResults.products.slice(0, 8).map(prod => (
                                <div 
                                    key={prod.id} 
                                    className="p-2 hover:surface-hover cursor-pointer border-round flex align-items-center gap-3 transition-colors"
                                    onClick={() => { nav(`/product/${prod.id}`); op.current.hide(); }}
                                >
                                    <img src={prod.imageName} alt={prod.title} className="w-3rem h-3rem border-round object-cover shadow-1" />
                                    <div className="flex flex-column">
                                        <span className="font-medium line-clamp-1">{prod.title}</span>
                                        <span className="text-xs text-primary font-bold">₹{prod.price}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {searchQuery.length > 1 && searchResults.products.length === 0 && searchResults.categories.length === 0 && !isSearching && (
                        <div className="p-4 text-center">
                            <i className="pi pi-search-plus text-4xl text-200 mb-2 block"></i>
                            <span className="text-secondary">No matches found for "{searchQuery}"</span>
                        </div>
                    )}

                    {(searchResults.products.length > 0 || searchResults.categories.length > 0) && (
                        <div 
                            className="p-3 text-center border-top-1 surface-border hover:surface-hover cursor-pointer"
                            onClick={() => { nav(`/search?q=${encodeURIComponent(searchQuery)}`); op.current.hide(); }}
                        >
                            <span className="font-bold text-primary">View All Results</span>
                        </div>
                    )}
                </div>
            </OverlayPanel>
            
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
                        <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{user.firstName || 'User'}</span>
                    </div>
                    <Button icon="pi pi-user" rounded text severity="secondary" onClick={() => nav('/profile')} className="hidden lg:inline-flex" />
                    <Button icon="pi pi-power-off" rounded text severity="danger" onClick={handleLogout} className="hidden lg:inline-flex" />
                </div>
            ) : (
                <div className="flex gap-2">
                    <Button label="Sign In" icon="pi pi-user" severity="secondary" text className="font-bold hidden lg:inline-flex" onClick={() => { setIsRegistering(false); setOpenLogin(true); }} />
                    <Button label="Sign Up" icon="pi pi-user-plus" severity="primary" className="font-bold hidden lg:inline-flex border-round-3xl" onClick={() => { setIsRegistering(true); setOpenLogin(true); }} />
                </div>
            )}

            <Button 
                rounded 
                text 
                severity="secondary" 
                onClick={() => nav('/cart')}
                className="p-0 flex align-items-center justify-content-center w-3rem h-3rem"
            >
                <i className="pi pi-shopping-cart p-overlay-badge" style={{ fontSize: '1.5rem' }}>
                    {cartCount > 0 && <Badge value={cartCount} severity="danger"></Badge>}
                </i>
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
            
            <Sidebar visible={openLogin} onHide={() => setOpenLogin(false)} position="right" className="w-full md:w-30rem" style={{ background: 'var(--surface-card)', color: 'var(--text-primary)' }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {isRegistering ? 'Create Account' : 'Welcome Back'}
                </Typography>
                {isRegistering ? (
                    <Register 
                        isModal={true} 
                        onSuccess={async (data) => {
                            setOpenLogin(false);
                            await syncCart();
                            refreshCart();
                        }}
                        onSwitchToLogin={() => setIsRegistering(false)}
                    />
                ) : (
                    <Login 
                        isModal={true} 
                        onSuccess={async () => {
                            setOpenLogin(false);
                            await syncCart();
                            refreshCart();
                        }} 
                        onSwitchToRegister={() => setIsRegistering(true)}
                    />
                )}
            </Sidebar>
        </div>
    );
}

// Minimal Typography mock to avoid MUI dependency if possible, or just use MUI for now if Typography is still needed elsewhere
function Typography({ children, variant, sx, className, component: Component = 'div', style, ...props }) {
    return <Component className={className} style={{ ...style, ...sx }} {...props}>{children}</Component>;
}
