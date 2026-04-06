import React, { useEffect, useState } from 'react';
import { Menu } from 'primereact/menu';
import { PanelMenu } from 'primereact/panelmenu';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { useAppTheme } from '../../context/ThemeContext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';

export default function AppSidebar({ visible, onHide }) {
    const { user, logout } = useAuth();
    const { mode, toggleTheme } = useAppTheme();
    const nav = useNavigate();
    const [categories, setCategories] = useState([]);
    const [offers, setOffers] = useState([]);

    const handleLogout = () => {
        logout();
        nav('/');
        if (onHide) onHide();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, offerRes] = await Promise.all([
                    api.get('/category/all').catch(() => ({ data: [] })),
                    api.get('/public/store/offers').catch(() => ({ data: [] }))
                ]);
                setCategories(catRes.data || []);
                setOffers(offerRes.data || []);
            } catch (err) {
                console.error("Sidebar data fetch error", err);
            }
        };
        fetchData();
    }, []);

    const handleNav = (path) => {
        nav(path);
        if (onHide) onHide();
    };

    const getRoleItems = () => {
        if (!user) return [];

        const adminItems = [
            { label: 'Storefront Home', icon: 'pi pi-home', command: () => handleNav('/') },
            { label: 'Dashboard', icon: 'pi pi-chart-bar', command: () => handleNav('/admin') },
            { label: 'User Management', icon: 'pi pi-users', command: () => handleNav('/admin/users') },
            { label: 'Product Catalog', icon: 'pi pi-box', command: () => handleNav('/admin/products') },
            { label: 'Order Processing', icon: 'pi pi-shopping-bag', command: () => handleNav('/admin/orders') },
            { label: 'Promotions (Ads)', icon: 'pi pi-megaphone', command: () => handleNav('/admin/ads') },
            { label: 'Discount Offers', icon: 'pi pi-percentage', command: () => handleNav('/admin/offers') },
            { label: 'Seller Partners', icon: 'pi pi-id-card', command: () => handleNav('/admin/sellers') },
            { label: 'Stock Storerooms', icon: 'pi pi-building', command: () => handleNav('/admin/storerooms') },
            { label: 'Inventory Details', icon: 'pi pi-database', command: () => handleNav('/admin/inventory') },
            { label: 'Policy Rules', icon: 'pi pi-shield', command: () => handleNav('/admin/rules') }
        ];

        const userItems = [
            { label: 'Storefront Home', icon: 'pi pi-home', command: () => handleNav('/') },
            { label: 'My Profile', icon: 'pi pi-user-edit', command: () => handleNav('/profile') },
            { label: 'My Orders', icon: 'pi pi-list', command: () => handleNav('/orders') },
            { label: 'My Favorites', icon: 'pi pi-heart', command: () => handleNav('/favorites') },
            { label: 'My Addresses', icon: 'pi pi-map-marker', command: () => handleNav('/addresses') }
        ];

        const deliveryItems = [
            { label: 'Storefront Home', icon: 'pi pi-home', command: () => handleNav('/') },
            { label: 'Assigned Deliveries', icon: 'pi pi-truck', command: () => handleNav('/delivery') },
            { label: 'Delivery History', icon: 'pi pi-history', command: () => handleNav('/delivery/history') }
        ];

        const editorItems = [
            { label: 'Storefront Home', icon: 'pi pi-home', command: () => handleNav('/') },
            { label: 'Manage Ads', icon: 'pi pi-megaphone', command: () => handleNav('/admin/ads') },
            { label: 'Manage Offers', icon: 'pi pi-percentage', command: () => handleNav('/admin/offers') },
            { label: 'Manage Sellers', icon: 'pi pi-id-card', command: () => handleNav('/admin/sellers') },
            { label: 'Manage Storerooms', icon: 'pi pi-building', command: () => handleNav('/admin/storerooms') },
            { label: 'Manage Inventory', icon: 'pi pi-database', command: () => handleNav('/admin/inventory') }
        ];

        switch (user.role) {
            case 'ADMIN': return adminItems;
            case 'EDITOR': return editorItems;
            case 'DELIVERY': return deliveryItems;
            default: return userItems;
        }
    };

    const mobileItems = [
        {
            label: 'Quick Search',
            className: 'lg:hidden',
            icon: 'pi pi-search',
            template: (item, options) => (
                <div className="p-3 lg:hidden">
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText placeholder="Search products..." className="p-inputtext-sm w-full" style={{ borderRadius: '4px' }} />
                    </IconField>
                </div>
            )
        },
        {
            label: 'Preferences',
            className: 'lg:hidden',
            icon: 'pi pi-palette',
            items: [
                {
                    label: mode === 'light' ? 'Dark Mode' : 'Light Mode',
                    icon: mode === 'light' ? 'pi pi-moon' : 'pi pi-sun',
                    command: () => {
                        toggleTheme();
                        if (onHide) onHide();
                    }
                }
            ]
        }
    ];

    const menuItems = [
        ...mobileItems,
        {
            label: 'Shop by Category',
            icon: 'pi pi-th-large',
            items: categories.map(cat => ({
                label: cat.title,
                icon: 'pi pi-chevron-right',
                command: () => handleNav(`/category/${cat.id}`)
            }))
        },
        {
            label: 'Latest Offers',
            icon: 'pi pi-bolt',
            items: offers.map(off => ({
                label: `${off.name} (${off.discountPercent}%)`,
                icon: 'pi pi-tag',
                template: (item, options) => (
                    <div className="flex align-items-center p-menuitem-link" onClick={() => {
                        options.onClick();
                        if (onHide) onHide();
                    }}>
                        <span className={options.iconClassName}></span>
                        <span className="flex-grow-1">{item.label}</span>
                        {off.discountPercent > 20 && <Badge value="HOT" severity="danger" className="ml-2" />}
                    </div>
                )
            }))
        },
        {
            label: 'Account & Operations',
            icon: 'pi pi-cog',
            items: [
                ...getRoleItems(),
                {
                    label: 'Sign Out',
                    icon: 'pi pi-power-off',
                    className: 'lg:hidden',
                    command: () => {
                        // We need access to logout here if we want it in the menu
                        // But handleNav/nav is enough for now if they click logout in header or we add it later
                    }
                }
            ]
        }
    ];

    return (
        <div className="flex flex-column h-full surface-card border-right-1 border-surface-border shadow-1 overflow-y-auto"
            style={{
                width: '280px',
                minHeight: 'calc(100vh - 64px)',
                background: 'var(--surface-card)'
            }}>
            {user ? (
                <div className="p-4 mb-2 flex align-items-center gap-3 shadow-2"
                    style={{
                        background: mode === 'light' ? 'linear-gradient(135deg, #1A237E 0%, #4169E1 100%)' : 'var(--primary-color)',
                        color: '#ffffff'
                    }}>
                    <Avatar
                        label={user.firstName ? user.firstName[0] : 'U'}
                        size="large"
                        shape="circle"
                        className="bg-white text-primary font-bold shadow-1"
                    />
                    <div className="flex flex-column">
                        <span className="text-xs opacity-80" style={{ color: '#ffffff' }}>Hello,</span>
                        <span className="font-bold text-lg" style={{ color: '#ffffff' }}>{user.firstName || 'User'}</span>
                    </div>
                </div>
            ) : (
                <div className="p-4 surface-section border-bottom-1 border-surface-border mb-2 flex align-items-center gap-3 shadow-1">
                    <Avatar icon="pi pi-user" size="large" shape="circle" className="bg-primary text-white shadow-1" />
                    <div className="flex flex-column">
                        <span className="text-xs text-color-secondary">Welcome Guest,</span>
                        <div className="flex gap-2">
                            <span className="font-bold text-primary cursor-pointer hover:underline" onClick={() => nav('/login')}>Login</span>
                            <span className="text-400">|</span>
                            <span className="font-bold text-primary cursor-pointer hover:underline" onClick={() => nav('/register')}>Sign Up</span>
                        </div>
                    </div>
                </div>
            )}

            <PanelMenu model={menuItems} className="w-full sidebar-menu flex-grow-1" />
        </div>
    );
}
