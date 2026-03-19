import React, {useState} from 'react'
import {Alert, Button, CircularProgress, Paper, Stack, TextField, Typography} from '@mui/material'
import api from '../services/api'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'

export default function Login() {
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
            if (data.role === 'ADMIN') nav('/admin'); else if (data.role === 'DELIVERY') nav('/delivery'); else nav('/admin');
        } catch (err) {
            setError(err?.response?.data || 'Login failed')
        } finally {
            setLoading(false)
        }
    }
    return (
        <Paper sx={{maxWidth: 420, mx: 'auto', mt: 6, p: 3}}>
            <Typography variant='h6' gutterBottom>Sign in</Typography>
            {error && <Alert severity='error' sx={{mb: 2}}>{error}</Alert>}
            <Stack spacing={2} component='form' onSubmit={submit}>
                <TextField label='Email or Mobile' value={form.identifier}
                           onChange={e => setForm({...form, identifier: e.target.value})} required/>
                <TextField label='Password' type='password' value={form.password}
                           onChange={e => setForm({...form, password: e.target.value})} required/>
                <Button type='submit' variant='contained' disabled={loading}>{loading ?
                    <CircularProgress size={20}/> : 'Login'}</Button>
            </Stack>
        </Paper>
    )
}
