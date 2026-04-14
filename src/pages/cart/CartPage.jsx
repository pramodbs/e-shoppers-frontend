import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import { Skeleton } from 'primereact/skeleton';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAppTheme } from '../../context/ThemeContext';

export default function CartPage() {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState('0');
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');
    const { refreshCart } = useCart();
    const { mode } = useAppTheme();
    const nav = useNavigate();

    const load = async () => {
        setLoading(true);
        setMsg('');
        const u = localStorage.getItem('esh_user');

        if (u) {
            try {
                const { data } = await api.get('/user/myCart');
                setItems(data.cartData || []);
                setTotal(data.totalCartPrice || '0');
            } catch {
                setMsg('Could not load your cart. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            // Guest mode
            try {
                const gCart = JSON.parse(localStorage.getItem('esh_guest_cart') || '[]');
                setItems(gCart);
                const gTotal = gCart.reduce((acc, it) => acc + (it.price * it.quantity), 0);
                setTotal(gTotal.toString());
            } catch {
                setMsg('Failed to read local cart.');
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => { load() }, []);

    const removeItem = async (id) => {
        const u = localStorage.getItem('esh_user');
        if (u) {
            try {
                await api.delete(`/user/cart/${id}`);
                load();
                refreshCart();
            } catch {
                setMsg('Failed to remove item.');
            }
        } else {
            // Guest remove (id here is productId)
            const gCart = JSON.parse(localStorage.getItem('esh_guest_cart') || '[]');
            const newCart = gCart.filter(it => it.productId !== id);
            localStorage.setItem('esh_guest_cart', JSON.stringify(newCart));
            load();
            refreshCart();
        }
    };

    const formatPrice = (val) => new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(val || 0);

    const productTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span className="font-bold">{rowData.productName}</span>
            </div>
        );
    };

    const priceTemplate = (rowData) => {
        return formatPrice(rowData.price);
    };

    const actionTemplate = (rowData) => {
        return (
            <Button 
                icon="pi pi-trash" 
                rounded 
                outlined 
                severity="danger" 
                onClick={() => removeItem(rowData.cartId || rowData.productId)} 
                className="h-2rem w-2rem"
                tooltip="Remove Item"
            />
        );
    };

    const quantityTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                 <span className="p-badge p-badge-info p-badge-no-gutter w-2rem h-2rem flex align-items-center justify-content-center border-round-md">
                    {rowData.quantity}
                 </span>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4 max-w-5xl mt-5">
                <Skeleton width="15rem" height="2rem" className="mb-4" />
                <DataTable value={[1, 2, 3]} className="p-datatable-striped">
                    <Column header="#" body={() => <Skeleton />}></Column>
                    <Column header="Product" body={() => <Skeleton />}></Column>
                    <Column header="Qty" body={() => <Skeleton />}></Column>
                    <Column header="Price" body={() => <Skeleton />}></Column>
                    <Column header="Action" body={() => <Skeleton />}></Column>
                </DataTable>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-5xl mt-5">
            <div className="flex align-items-center gap-2 mb-4">
                <i className="pi pi-shopping-cart text-3xl text-primary"></i>
                <h2 className="text-3xl font-bold m-0">Shopping Cart</h2>
                <span className="p-badge p-badge-info font-bold ml-2">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
            </div>

            {msg && <Message severity="error" text={msg} className="w-full mb-4" />}

            {items.length === 0 ? (
                <div className="surface-card p-8 border-round-xl shadow-2 text-center mt-4">
                    <h3 className="text-2xl font-bold text-color">Your cart is empty</h3>
                    <p className="text-color-secondary mb-5">Looks like you haven't added anything yet.</p>
                    <Button label="Continue Shopping" icon="pi pi-arrow-left" className="p-button-lg border-round-3xl" onClick={() => nav('/')} />
                </div>
            ) : (
                <div className="grid">
                    <div className="col-12 lg:col-8">
                        <Card className="shadow-2 border-round-xl h-full">
                            <DataTable value={items} className="p-datatable-sm" responsiveLayout="scroll">
                                <Column header="#" body={(_, options) => options.rowIndex + 1} style={{ width: '3rem' }}></Column>
                                <Column header="Product" body={productTemplate}></Column>
                                <Column header="Qty" body={quantityTemplate} align="center"></Column>
                                <Column header="Price" body={priceTemplate} align="right"></Column>
                                <Column header="Action" body={actionTemplate} align="center" style={{ width: '5rem' }}></Column>
                            </DataTable>
                        </Card>
                    </div>
                    
                    <div className="col-12 lg:col-4">
                        <Card className="shadow-2 border-round-xl h-full" title="Order Summary">
                            <div className="flex justify-content-between mb-3">
                                <span className="text-color">Subtotal</span>
                                <span className="font-bold">{formatPrice(total)}</span>
                            </div>
                            <div className="flex justify-content-between mb-3 text-green-500 font-bold">
                                <span>Shipping</span>
                                <span>FREE</span>
                            </div>
                            <Divider />
                            <div className="flex justify-content-between mb-4 text-xl font-bold">
                                <span>Total</span>
                                <span className="text-primary">{formatPrice(total)}</span>
                            </div>
                            <Button 
                                label={`Proceed to Checkout`} 
                                icon="pi pi-credit-card" 
                                className="w-full p-button-lg font-bold border-round-3xl"
                                style={{ background: '#FF8C00', borderColor: '#FF8C00' }}
                                onClick={() => nav('/checkout')} 
                            />
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
