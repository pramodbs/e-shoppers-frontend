import React, { useState } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import api from '../../services/api';

export default function StripePayment({ clientSecret, onPaymentSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL for fallback if redirect happens
                return_url: window.location.origin + "/payment-success",
            },
            redirect: 'if_required'
        });

        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message);
            } else {
                setMessage("An unexpected error occurred.");
            }
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Confirm the order on the backend
            try {
                await api.post('/payment/confirm-payment', { 
                    paymentIntentId: paymentIntent.id 
                });
                onPaymentSuccess(paymentIntent);
            } catch (err) {
                setMessage("Payment succeeded, but we failed to confirm your order. Please contact support.");
            }
            setIsLoading(false);
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="mt-4">
            <PaymentElement id="payment-element" />
            
            {message && <Message severity="error" text={message} className="w-full mt-4" />}
            
            <Button
                id="submit"
                disabled={isLoading || !stripe || !elements}
                label={isLoading ? "Processing..." : "Pay Now"}
                icon={isLoading ? "pi pi-spin pi-spinner" : "pi pi-credit-card"}
                className="w-full mt-6 p-button-lg border-round-3xl"
                style={{ background: '#6366F1', borderColor: '#6366F1' }}
            />
        </form>
    );
}
