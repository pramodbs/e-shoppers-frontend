import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Message } from 'primereact/message'
import { Card } from 'primereact/card'
import { ProgressSpinner } from 'primereact/progressspinner'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login({ isModal, onSuccess, onSwitchToRegister }) {
    const [form, setForm] = useState({ identifier: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const nav = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth()

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true)
        try {
            const { data } = await api.post('/user/login', form);
            login(data);
            if (onSuccess) {
                onSuccess(data);
            } else {
                const target = searchParams.get('redirect') || '/';
                nav(target);
            }
        } catch (err) {
            const msg = err?.response?.data;
            setError(typeof msg === 'object' ? (msg.message || 'Login failed') : (msg || 'Login failed'));
        } finally {
            setLoading(false)
        }
    }

    const formContent = (
        <div className={isModal ? 'p-0' : 'p-3'}>
            {!isModal && <h2 className="text-2xl font-bold mb-4">Sign in</h2>}
            {error && <Message severity="error" text={error} className="w-full mb-3" />}
            
            <form onSubmit={submit} className="p-fluid">
                <div className="field mb-3">
                    <label htmlFor="identifier">Email or Mobile</label>
                    <InputText id="identifier" value={form.identifier} onChange={e => setForm({ ...form, identifier: e.target.value })} required />
                </div>
                <div className="field mb-4">
                    <label htmlFor="password">Password</label>
                    <InputText id="password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                </div>
                <Button 
                    type="submit" 
                    label={loading ? '' : 'Login'} 
                    disabled={loading}
                    icon={loading ? 'pi pi-spin pi-spinner' : ''}
                    className="w-full p-3 font-bold mb-3"
                />
                
                {onSwitchToRegister && (
                    <div className="text-center mt-3">
                        <span className="text-600">Don't have an account? </span>
                        <Button 
                            type="button" 
                            label="Sign Up" 
                            className="p-button-link p-0 font-bold" 
                            onClick={onSwitchToRegister} 
                        />
                    </div>
                )}
            </form>
        </div>
    )

    return isModal ? formContent : (
        <div className="flex justify-content-center mt-6">
            <Card style={{ width: '420px' }}>
                {formContent}
            </Card>
        </div>
    );
}
