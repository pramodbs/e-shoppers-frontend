import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/common/ProductCard';
import { DataView } from 'primereact/dataview';
import { Carousel } from 'primereact/carousel';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useAppTheme } from '../context/ThemeContext';
import { Button } from 'primereact/button';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [ads, setAds] = useState([]);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { mode } = useAppTheme();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, adsRes, offersRes] = await Promise.all([
                axios.get('/api/product/all').catch(() => ({ data: [] })),
                axios.get('/api/public/store/ads').catch(() => ({ data: [] })),
                axios.get('/api/public/store/offers').catch(() => ({ data: [] }))
            ]);

            setProducts(prodRes.data);
            setAds(adsRes.data);
            setOffers(offersRes.data);

            if (!prodRes.data || prodRes.data.length === 0) {
                setProducts([
                    { id: 1, title: 'Premium Wireless Headphones', price: 12999, quantity: 10 },
                    { id: 2, title: 'Smart Watch Series 9', price: 45000, quantity: 4 },
                    { id: 3, title: 'Mechanical Gaming Keyboard', price: 8500, quantity: 15 },
                    { id: 4, title: 'Ergonomic Laptop Stand', price: 2499, quantity: 0 },
                    { id: 5, title: 'Pro Wireless Mouse', price: 5999, quantity: 20 },
                    { id: 6, title: 'UltraWide 4K Monitor', price: 38000, quantity: 2 }
                ]);
            }
        } catch (err) {
            console.error("Error fetching data", err);
            setError("Failed to load storefront data");
        } finally {
            setLoading(false);
        }
    };

    const offerTemplate = (offer) => (
        <div className="surface-card p-4 shadow-2 m-2 border-round-xl text-center" style={{ background: mode === 'light' ? 'linear-gradient(135deg, #1A237E 0%, #4169E1 100%)' : 'var(--surface-card)', color: mode === 'light' ? '#fff' : 'var(--text-primary)', border: mode === 'dark' ? '1px solid var(--surface-border)' : 'none' }}>
            <h4 className="mb-1 text-xl font-bold">{offer.name || 'Special Offer'}</h4>
            <h1 className="mb-3 text-4xl font-bold" style={{ color: '#FF8C00' }}>{offer.discountPercent || 20}% OFF</h1>
            <p className="mb-3 opacity-80">{offer.description || 'Limited time savings'}</p>
            {offer.minSpend > 0 && <span className="p-badge p-badge-warning">Min Spend ₹{offer.minSpend}</span>}
        </div>
    );

    const adTemplate = (ad) => (
        <div 
            className="surface-card shadow-2 m-2 border-round-xl h-15rem relative overflow-hidden cursor-pointer hover:shadow-4 transition-all duration-300" 
            onClick={() => ad.linkUrl && window.open(ad.linkUrl, '_blank')}
            style={{ 
                backgroundImage: `url(${ad.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop'})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
            }}
        >
            <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.9))' }}>
                <h3 className="text-white font-bold m-0 text-lg md:text-xl line-height-2" style={{ wordBreak: 'break-word' }}>{ad.title || 'Spring Collection'}</h3>
                <p className="text-white opacity-80 mt-1 text-sm md:text-base line-height-3">{ad.content || 'Explore the new arrivals'}</p>
            </div>
        </div>
    );

    const carouselResponsiveOptions = [
        {
            breakpoint: '1199px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '991px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    const itemTemplate = (product) => {
        return <ProductCard product={product} />;
    };

    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center h-screen">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-6" style={{ background: 'var(--surface-bg)', color: 'var(--text-primary)' }}>
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-no-repeat bg-cover p-4 md:p-8 text-center" style={{ 
                height: '400px', 
                background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div className="flex justify-content-center align-items-center h-full">
                    <div className="text-white max-w-30rem md:max-w-none">
                        <h1 className="mb-3 text-4xl md:text-6xl font-bold line-height-2" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.6)' }}>The Great Savings Festival</h1>
                        <h4 className="mb-4 text-base md:text-xl opacity-90" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.6)' }}>Up to 70% off on Premium Electronics</h4>
                        <Button label="Shop Now" icon="pi pi-shopping-bag" className="p-button-lg font-bold border-round-3xl" style={{ background: '#FF8C00', borderColor: '#FF8C00' }} />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 relative z-1">
                {error && <Message severity="error" text={error} className="w-full mb-4" />}

                {/* Promotional Carousels */}
                <div className="grid">
                    <div className="col-12 lg:col-5">
                        <h3 className="text-xl md:text-2xl font-bold mb-3 px-2">Featured Offers</h3>
                        <Carousel value={offers.length > 0 ? offers : [{id:1}]} itemTemplate={offerTemplate} numVisible={1} numScroll={1} circular autoplayInterval={3000} />
                    </div>
                    <div className="col-12 lg:col-7">
                        <h3 className="text-xl md:text-2xl font-bold mb-3 px-2">Sponsored Ads</h3>
                        <Carousel 
                            value={ads.length > 0 ? ads : [{id:1, title: 'Summer Extravaganza', content: 'Huge discounts on all categories'}]} 
                            itemTemplate={adTemplate} 
                            numVisible={2} 
                            numScroll={1} 
                            responsiveOptions={carouselResponsiveOptions}
                            circular 
                            autoplayInterval={4000} 
                        />
                    </div>
                </div>

                {/* Product Grid */}
                <div className="mt-6">
                    <div className="flex justify-content-between align-items-center px-2 mb-4">
                        <h3 className="text-3xl font-bold m-0">Discover Products</h3>
                        <div className="flex gap-2">
                             <Button icon="pi pi-filter" rounded text severity="secondary" />
                             <Button icon="pi pi-sort-alt" rounded text severity="secondary" />
                        </div>
                    </div>
                    
                    <DataView value={products} itemTemplate={itemTemplate} layout="grid" />
                    
                    {products.length === 0 && !error && (
                        <div className="text-center p-8 surface-card border-round-xl shadow-1" style={{ background: 'var(--surface-card)', color: 'var(--text-primary)' }}>
                            <i className="pi pi-search text-600 text-5xl mb-3"></i>
                            <p>No products found. Please try again later.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
