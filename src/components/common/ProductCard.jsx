import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Badge } from 'primereact/badge';
import { Toast } from 'primereact/toast';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useAppTheme } from '../../context/ThemeContext';

export default function ProductCard({ product, onLoginRequired }) {
    const { user } = useAuth();
    const { addToCart, adding } = useCart();
    const { mode } = useAppTheme();
    const toast = React.useRef(null);

    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(product.price);

    const imageUrl = product.imageName || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';

    const handleAddToCart = async (e) => {
        if (e) e.stopPropagation();

        const result = await addToCart(product, 1);
        toast.current.show({ 
            severity: result.success ? 'success' : 'error', 
            summary: result.success ? 'Success' : 'Error', 
            detail: result.message, 
            life: 3000 
        });
    };

    const header = (
        <div className="flex justify-content-center p-3 relative" style={{ background: 'var(--surface-bg)', borderRadius: '12px 12px 0 0' }}>
            <Link to={`/product/${product.id}`} className="w-full">
                <img 
                    alt={product.title} 
                    src={imageUrl} 
                    className="w-full h-15rem object-contain transition-transform duration-300 hover:scale-105" 
                    style={{ mixBlendMode: mode === 'light' ? 'multiply' : 'normal' }}
                />
            </Link>
            {product.quantity <= 5 && product.quantity > 0 && (
                <Badge value={`Only ${product.quantity} left`} severity="warning" className="absolute top-0 right-0 m-2"></Badge>
            )}
            {product.quantity === 0 && (
                <Badge value="Out of Stock" severity="danger" className="absolute top-0 right-0 m-2"></Badge>
            )}
        </div>
    );

    const footer = (
        <Button 
            label={product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'} 
            icon="pi pi-shopping-cart" 
            className="w-full font-bold border-round-3xl" 
            style={{ 
                background: 'var(--secondary-color, #FF8C00)', 
                borderColor: 'var(--secondary-color, #FF8C00)',
                color: '#fff'
            }}
            onClick={handleAddToCart}
            disabled={adding || product.quantity === 0}
        />
    );

    return (
        <div className="col-12 sm:col-6 lg:col-3 p-2">
            <Toast ref={toast} />
            <Card 
                header={header} 
                footer={footer}
                className="shadow-2 hover:shadow-4 transition-all duration-300 h-full flex flex-column border-round-xl border-1 border-transparent hover:border-primary"
            >
                <div className="flex flex-column h-full">
                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <span 
                            className="text-lg font-bold mb-2 block line-clamp-2 min-h-3rem overflow-hidden text-overflow-ellipsis hover:text-primary transition-colors duration-200" 
                            title={product.title}
                            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                        >
                            {product.title}
                        </span>
                    </Link>
                    
                    <div className="flex align-items-center mb-3">
                        <Rating value={4} readOnly cancel={false} className="mr-2" />
                        <span className="text-color-secondary text-sm">(128)</span>
                    </div>

                    <div className="mt-auto pt-2">
                        <span className="text-2xl font-bold text-primary">{formattedPrice}</span>
                    </div>
                </div>
            </Card>
        </div>
    );
}
