import React, {useState} from 'react'
import {Alert, Box, Button, CircularProgress, Paper, Stack, TextField, Typography} from '@mui/material'
import api from '../services/api'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'

export default function Login({ isModal, onSuccess }) {
    const [form, setForm] = useState({identifier: '', password: ''})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const nav = useNavigate();
    const {login} = useAuth()
    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true)
        try {
            const {data} = await api.post('/user/login', form);
            login(data);
            if (onSuccess) {
                onSuccess(data);
            } else {
                if (data.role === 'ADMIN' || data.role === 'EDITOR') nav('/admin'); 
                else if (data.role === 'DELIVERY') nav('/delivery'); 
                else nav('/');
            }
        } catch (err) {
            const msg = err?.response?.data;
            setError(typeof msg === 'object' ? (msg.message || 'Login failed') : (msg || 'Login failed'));
        } finally {
            setLoading(false)
        }
    }
    const formContent = (
        <Box sx={{p: isModal ? 0 : 3}}>
            {!isModal && <Typography variant='h6' gutterBottom>Sign in</Typography>}
            {error && <Alert severity='error' sx={{mb: 2}}>{error}</Alert>}
            <Stack spacing={2} component='form' onSubmit={submit}>
                <TextField label='Email or Mobile' value={form.identifier}
                           onChange={e => setForm({...form, identifier: e.target.value})} required/>
                <TextField label='Password' type='password' value={form.password}
                           onChange={e => setForm({...form, password: e.target.value})} required/>
                <Button 
                    type='submit' 
                    variant='contained' 
                    color='secondary' 
                    fullWidth
                    disabled={loading}
                    sx={{ mt: 1, py: 1.2, fontWeight: 700 }}
                >
                    {loading ? <CircularProgress size={20}/> : 'Login'}
                </Button>
            </Stack>
        </Box>
    )

    return isModal ? formContent : <Paper sx={{maxWidth: 420, mx: 'auto', mt: 6}}>{formContent}</Paper>;
}
