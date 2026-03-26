import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Badge } from 'primereact/badge';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useAppTheme } from '../../context/ThemeContext';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart, adding } = useCart();
    const { mode } = useAppTheme();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const toast = useRef(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/product/${id}`);
                setProduct(data);
            } catch (err) {
                console.error("Error fetching product details", err);
                setError("Product not found or failed to load details.");
                // Fallback for demo purposes if API fails
                if (id <= 6) {
                    const mockProducts = [
                        { id: 1, title: 'Premium Wireless Headphones', price: 12999, quantity: 10, description: 'Experience studio-quality sound with these premium wireless headphones. Features active noise cancellation and 40-hour battery life.' },
                        { id: 2, title: 'Smart Watch Series 9', price: 45000, quantity: 4, description: 'The most advanced smart watch yet. Powerful sensors for health tracking, cellular connectivity, and a stunning always-on Retina display.' },
                        { id: 3, title: 'Mechanical Gaming Keyboard', price: 8500, quantity: 15, description: 'Precision mechanical switches, customizable RGB lighting, and robust aluminum construction for the ultimate gaming experience.' },
                        { id: 4, title: 'Ergonomic Laptop Stand', price: 2499, quantity: 0, description: 'Improve your posture and workstation ergonomics with this adjustable laptop stand. Sleek design with heat dissipation features.' },
                        { id: 5, title: 'Pro Wireless Mouse', price: 5999, quantity: 20, description: 'Ultra-lightweight wireless gaming mouse with sub-1ms response time and high-precision sensor.' },
                        { id: 6, title: 'UltraWide 4K Monitor', price: 38000, quantity: 2, description: 'Immersive 34-inch ultrawide 4K monitor with 99% sRGB color accuracy. Perfect for productivity and entertainment.' }
                    ];
                    setProduct(mockProducts.find(p => p.id === parseInt(id)));
                    setError('');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) {
            toast.current.show({ 
                severity: 'info', 
                summary: 'Sign In Required', 
                detail: 'Please log in to add items to your cart', 
                life: 3000 
            });
            return;
        }

        const result = await addToCart(product.id, 1);
        toast.current.show({ 
            severity: result.success ? 'success' : 'error', 
            summary: result.success ? 'Success' : 'Error', 
            detail: result.message, 
            life: 3000 
        });
    };

    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center h-screen">
                <ProgressSpinner />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto p-4 md:p-8">
                <Button 
                    label="Back to Products" 
                    icon="pi pi-arrow-left" 
                    className="p-button-text mb-4" 
                    onClick={() => navigate('/')} 
                />
                <Message severity="error" text={error || "Product not found"} className="w-full" />
            </div>
        );
    }

    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(product.price);

    const imageUrl = product.imageName || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';

    return (
        <div className="surface-ground min-h-screen pb-6">
            <Toast ref={toast} />
            <div className="container mx-auto p-4 md:p-8">
                <Button 
                    label="Back to Products" 
                    icon="pi pi-arrow-left" 
                    className="p-button-text mb-4 font-bold" 
                    onClick={() => navigate(-1)} 
                />

                <div className="grid bg-white border-round-xl shadow-2 overflow-hidden" 
                     style={{ backgroundColor: 'var(--surface-card)' }}>
                    {/* Left side: Image */}
                    <div className="col-12 md:col-6 p-0 flex justify-content-center align-items-center surface-100 min-h-20rem md:min-h-30rem">
                        <img 
                            src={imageUrl} 
                            alt={product.title} 
                            className="w-full h-full object-contain p-4 md:p-8 transition-transform duration-500 hover:scale-105"
                            style={{ mixBlendMode: mode === 'light' ? 'multiply' : 'normal' }}
                        />
                    </div>

                    {/* Right side: Details */}
                    <div className="col-12 md:col-6 p-4 md:p-8 flex flex-column">
                        <div className="flex justify-content-between align-items-start mb-4">
                            <div>
                                <h1 className="text-4xl font-bold m-0 mb-2">{product.title}</h1>
                                <div className="flex align-items-center gap-2">
                                    <Rating value={4} readOnly cancel={false} />
                                    <span className="text-color-secondary text-sm">(128 reviews)</span>
                                </div>
                            </div>
                            {product.quantity <= 5 && product.quantity > 0 && (
                                <Badge value={`Only ${product.quantity} left`} severity="warning" />
                            )}
                            {product.quantity === 0 && (
                                <Badge value="Out of Stock" severity="danger" />
                            )}
                        </div>

                        <div className="mb-6">
                            <span className="text-4xl font-bold text-primary">{formattedPrice}</span>
                            <p className="text-color-secondary mt-1 text-sm">Inclusive of all taxes</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-bold mb-3 border-bottom-1 surface-border pb-2">Product Description</h3>
                            <p className="line-height-3 text-lg opacity-80">
                                {product.description || "No description available for this product. Experience premium quality and exceptional performance with our latest collection."}
                            </p>
                        </div>

                        <div className="mt-auto grid">
                            <div className="col-12 sm:col-8">
                                <Button 
                                    label={product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'} 
                                    icon="pi pi-shopping-cart" 
                                    className="w-full p-3 text-xl font-bold border-round-3xl shadow-2" 
                                    style={{ 
                                        background: 'var(--secondary-color, #FF8C00)', 
                                        borderColor: 'var(--secondary-color, #FF8C00)',
                                        color: '#fff'
                                    }}
                                    onClick={handleAddToCart}
                                    disabled={adding || product.quantity === 0}
                                />
                            </div>
                            <div className="col-12 sm:col-4">
                                <Button 
                                    icon="pi pi-heart" 
                                    className="p-button-outlined p-button-secondary w-full p-3 border-round-3xl"
                                />
                            </div>
                        </div>

                        <div className="mt-6 border-top-1 surface-border pt-4 grid text-center">
                            <div className="col-4">
                                <i className="pi pi-truck text-2xl mb-2 text-primary"></i>
                                <span className="block text-xs uppercase font-bold opacity-60">Fast Delivery</span>
                            </div>
                            <div className="col-4">
                                <i className="pi pi-shield text-2xl mb-2 text-primary"></i>
                                <span className="block text-xs uppercase font-bold opacity-60">Secure Payment</span>
                            </div>
                            <div className="col-4">
                                <i className="pi pi-sync text-2xl mb-2 text-primary"></i>
                                <span className="block text-xs uppercase font-bold opacity-60">Easy Returns</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
