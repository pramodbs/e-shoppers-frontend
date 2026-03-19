import React, {useState} from 'react'
import {
    Alert,
    Button,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material'
import api from '../../services/api'
import {useAuth} from '../../context/AuthContext'

export default function DeliveryDashboard() {
    const {user} = useAuth()
    const [deliveryPersonId, setDeliveryPersonId] = useState('')
    const [rows, setRows] = useState([])
    const [error, setError] = useState('')
    const load = async () => {
        setError('');
        if (!deliveryPersonId) {
            setError('Enter your numeric Delivery Person ID');
            return
        }
        const {data} = await api.get('/user/delivery/myorder', {params: {deliveryPersonId}});
        setRows(data)
    }
    return (
        <Paper sx={{p: 2}}>
            <Typography variant='h6' sx={{mb: 2}}>My Delivery Orders</Typography>
            <Typography variant='body2' sx={{mb: 1}}>Logged in as: {user?.firstName} ({user?.role})</Typography>
            {error && <Alert severity='warning' sx={{mb: 2}}>{error}</Alert>}
            <Stack direction='row' spacing={1} sx={{mb: 2}}><TextField label='Delivery Person ID'
                                                                       value={deliveryPersonId}
                                                                       onChange={e => setDeliveryPersonId(e.target.value)}/><Button
                variant='contained' onClick={load}>Load</Button></Stack>
            <Table size='small'><TableHead><TableRow><TableCell>Order
                ID</TableCell><TableCell>Customer</TableCell><TableCell>Product</TableCell><TableCell>Qty</TableCell><TableCell>Status</TableCell><TableCell>Delivery
                Date</TableCell></TableRow></TableHead><TableBody>{rows.map(r => (<TableRow
                key={`${r.orderId}-${r.productId}`}><TableCell>{r.orderId}</TableCell><TableCell>{r.userName}</TableCell><TableCell>{r.productName}</TableCell><TableCell>{r.quantity}</TableCell><TableCell>{r.deliveryStatus}</TableCell><TableCell>{r.deliveryDate}</TableCell></TableRow>))}</TableBody></Table>
        </Paper>
    )
}
