import React, { useEffect, useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
    const stripe = useStripe();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const nav = useNavigate();

    useEffect(() => {
        if (!stripe) return;

        const clientSecret = new URLSearchParams(window.location.search).get(
            'payment_intent_client_secret'
        );

        if (!clientSecret) {
            setStatus('error');
            setMessage('No payment information found.');
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case 'succeeded':
                    setStatus('success');
                    setMessage('Your payment was successful!');
                    break;
                case 'processing':
                    setStatus('processing');
                    setMessage('Your payment is processing.');
                    break;
                case 'requires_payment_method':
                    setStatus('error');
                    setMessage('Your payment was not successful, please try again.');
                    break;
                default:
                    setStatus('error');
                    setMessage('Something went wrong.');
                    break;
            }
        });
    }, [stripe]);

    if (status === 'loading') {
        return (
            <div className="flex flex-column justify-content-center align-items-center h-screen gap-3">
                <ProgressSpinner />
                <span className="text-color-secondary font-bold">Verifying your payment...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl mt-8 text-center">
            <Card className="shadow-4 border-round-xl py-6">
                {status === 'success' ? (
                    <>
                        <i className="pi pi-check-circle text-green-500 mb-4" style={{ fontSize: '6rem' }}></i>
                        <h2 className="text-4xl font-bold mb-2 text-color">Payment Successful!</h2>
                        <p className="text-color mb-4 text-xl">{message}</p>
                    </>
                ) : (
                    <>
                        <i className="pi pi-exclamation-circle text-red-500 mb-4" style={{ fontSize: '6rem' }}></i>
                        <h2 className="text-4xl font-bold mb-2 text-color">Payment Issue</h2>
                        <p className="text-color mb-4 text-xl">{message}</p>
                    </>
                )}
                
                <Button label="Go to Home" icon="pi pi-home" className="mt-6 p-button-lg border-round-3xl" onClick={() => nav('/')} />
            </Card>
        </div>
    );
}
