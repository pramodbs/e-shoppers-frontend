import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { RadioButton } from 'primereact/radiobutton';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Steps } from 'primereact/steps';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';

const formatINR = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
}).format(val || 0);

export default function Checkout() {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState('0');
    const [method, setMethod] = useState('COD');
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [order, setOrder] = useState(null);
    const [err, setErr] = useState('');
    const { clearCart } = useCart();
    const nav = useNavigate();

    const steps = [
        { label: 'Cart' },
        { label: 'Checkout' },
        { label: 'Payment' },
        { label: 'Confirmation' }
    ];

    const load = async () => {
        setLoading(true);
        setErr('');
        try {
            const { data } = await api.get('/user/checkout/preview');
            setItems(data.items || []);
            setTotal(data.total || '0');
        } catch (e) {
            setErr('Failed to load checkout summary. Please go back to cart and try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load() }, []);

    const pay = async () => {
        setPaying(true);
        setErr('');
        try {
            const { data } = await api.post('/user/checkout/pay', { method });
            setOrder(data);
            clearCart();
        } catch (e) {
            setErr(typeof e?.response?.data === 'string' ? e.response.data : 'Payment failed. Please try again.');
        } finally {
            setPaying(false);
        }
    };

    if (order) {
        return (
            <div className="container mx-auto p-4 max-w-2xl mt-8 text-center">
                <Card className="shadow-4 border-round-xl py-6">
                    <i className="pi pi-check-circle text-green-500 mb-4" style={{ fontSize: '6rem' }}></i>
                    <h2 className="text-4xl font-bold mb-2 text-color">Order Placed!</h2>
                    <p className="text-color mb-4 text-xl">Thank you for your purchase. Your order is confirmed.</p>
                    
                    <Divider className="my-5" />
                    
                    <div className="flex flex-column align-items-center gap-3">
                        <span className="p-badge p-badge-info p-badge-lg px-4 py-2 border-round-3xl">Order ID: {order.orderId}</span>
                        <h3 className="text-3xl font-bold text-primary m-0">{formatINR(order.amount)}</h3>
                        <div className="flex align-items-center gap-2 text-color-secondary">
                             <i className="pi pi-truck"></i>
                             <span>Payment Method: <strong className="text-color">{order.method || 'COD'}</strong></span>
                        </div>
                    </div>
                    
                    <Button label="Continue Shopping" icon="pi pi-arrow-left" className="mt-6 p-button-lg border-round-3xl" onClick={() => nav('/')} />
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-column justify-content-center align-items-center h-screen gap-3">
                <ProgressSpinner />
                <span className="text-color-secondary font-bold">Securing your checkout...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-5xl mt-5">
            <Steps model={steps} activeIndex={1} className="mb-6" readOnly />

            <div className="grid">
                <div className="col-12 lg:col-8">
                    {err && <Message severity="error" text={err} className="w-full mb-4" />}
                    
                    <Card className="shadow-2 border-round-xl mb-4" title="Billing & Shipping">
                         <div className="grid p-fluid mt-2">
                            <div className="col-12 md:col-6">
                                <label className="block text-900 font-bold mb-2">Contact Holder</label>
                                <div className="p-3 surface-100 border-round">{items.length > 0 ? 'Home Delivery' : 'Not Available'}</div>
                            </div>
                         </div>
                    </Card>

                    <Card className="shadow-2 border-round-xl" title="Payment Method">
                        <div className="flex flex-column gap-4 mt-2">
                            {[
                                { id: 'COD', label: 'Cash on Delivery (COD)', icon: 'pi-wallet' },
                                { id: 'UPI', label: 'UPI / QR Code', icon: 'pi-mobile' },
                                { id: 'CARD', label: 'Credit / Debit Card', icon: 'pi-credit-card' },
                                { id: 'NETBANKING', label: 'Net Banking', icon: 'pi-globe' }
                            ].map((opt) => (
                                <div key={opt.id} className={`flex align-items-center p-3 border-round-lg cursor-pointer transition-colors duration-200 ${method === opt.id ? 'surface-100 border-primary' : 'surface-card border-1 border-surface-border'}`} onClick={() => setMethod(opt.id)}>
                                    <RadioButton inputId={opt.id} value={opt.id} onChange={(e) => setMethod(e.value)} checked={method === opt.id} className="mr-3" />
                                    <label htmlFor={opt.id} className="cursor-pointer flex-grow-1 flex align-items-center gap-3">
                                        <i className={`pi ${opt.icon} text-xl text-primary`}></i>
                                        <span className="font-bold">{opt.label}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="col-12 lg:col-4">
                    <Card className="shadow-2 border-round-xl sticky top-8" title="Order Summary">
                        <DataTable value={items} className="p-datatable-sm mb-4" responsiveLayout="scroll">
                            <Column header="Product" body={(it) => <span className="text-sm">{it.title}</span>}></Column>
                            <Column header="Qty" field="qty" align="center" style={{ width: '3rem' }} body={(it) => <span className="text-xs text-color-secondary">x{it.qty}</span>}></Column>
                            <Column header="Total" body={(it) => <span className="text-sm font-bold">{formatINR(it.total)}</span>} align="right"></Column>
                        </DataTable>
                        
                        <Divider />
                        
                        <div className="flex justify-content-between mb-4">
                            <span className="text-xl font-bold">Grand Total</span>
                            <span className="text-2xl font-bold text-primary">{formatINR(total)}</span>
                        </div>

                        <div className="flex flex-column gap-3">
                            <Button 
                                label={paying ? "Processing..." : `Complete Order`} 
                                icon={paying ? "pi pi-spin pi-spinner" : "pi pi-check-circle"} 
                                className="w-full p-button-lg font-bold border-round-3xl"
                                style={{ background: '#FF8C00', borderColor: '#FF8C00' }}
                                disabled={paying || items.length === 0}
                                onClick={pay}
                            />
                            <Button label="Back to Cart" icon="pi pi-arrow-left" className="w-full p-button-text font-bold" onClick={() => nav('/cart')} />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
