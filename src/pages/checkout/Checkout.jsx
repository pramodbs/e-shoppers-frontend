import React, {useEffect, useState} from 'react'
import {
    Alert,
    Button,
    FormControlLabel,
    Paper,
    Radio,
    RadioGroup,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material'
import {useSearchParams} from 'react-router-dom'
import api from '../../services/api'

export default function Checkout() {
    const [sp] = useSearchParams()
    const [userId, setUserId] = useState(sp.get('userId') || '')
    const [items, setItems] = useState([])
    const [total, setTotal] = useState('0')
    const [method, setMethod] = useState('COD')
    const [resp, setResp] = useState(null)
    const [err, setErr] = useState('')

    const load = async () => {
        if (!userId) {
            setErr('Enter User ID');
            return
        }
        setErr('')
        const {data} = await api.get('/user/checkout/preview', {params: {userId}})
        setItems(data.items || [])
        setTotal(data.total || '0')
    }
    useEffect(() => {
        load()
    }, [])

    const pay = async () => {
        try {
            const {data} = await api.post('/user/checkout/pay', {userId: Number(userId), method})
            setResp(data)
        } catch (e) {
            setErr(e?.response?.data || 'Payment failed')
        }
    }

    return (
        <Paper sx={{p: 2}}>
            <Typography variant='h6' sx={{mb: 2}}>Checkout</Typography>
            {err && <Alert severity='error' sx={{mb: 2}}>{String(err)}</Alert>}
            <Stack direction='row' spacing={1} sx={{mb: 2}}>
                <TextField label='User ID' value={userId} onChange={e => setUserId(e.target.value)}/>
                <Button variant='outlined' onClick={load}>Refresh</Button>
            </Stack>

            <Table size='small'>
                <TableHead><TableRow><TableCell>Product</TableCell><TableCell>Qty</TableCell><TableCell>Unit</TableCell><TableCell>Total</TableCell></TableRow></TableHead>
                <TableBody>{items.map((it, idx) => (
                    <TableRow
                        key={idx}><TableCell>{it.title}</TableCell><TableCell>{it.qty}</TableCell><TableCell>{it.unitPrice}</TableCell><TableCell>{it.total}</TableCell></TableRow>
                ))}</TableBody>
            </Table>

            <Typography variant='subtitle1' sx={{mt: 2}}>Grand Total: {total}</Typography>

            <Typography variant='subtitle2' sx={{mt: 2}}>Payment Method</Typography>
            <RadioGroup row value={method} onChange={e => setMethod(e.target.value)}>
                <FormControlLabel value='COD' control={<Radio/>} label='Cash on Delivery'/>
                <FormControlLabel value='UPI' control={<Radio/>} label='UPI'/>
                <FormControlLabel value='CARD' control={<Radio/>} label='Card'/>
                <FormControlLabel value='NETBANKING' control={<Radio/>} label='Netbanking'/>
            </RadioGroup>

            <Stack direction='row' spacing={2} sx={{mt: 2}}>
                <Button variant='contained' onClick={pay}>Pay & Place Order</Button>
            </Stack>

            {resp && (
                <Alert severity='success' sx={{mt: 2}}>
                    Payment: {resp.status} • Order ID: {resp.orderId} • Amount: {resp.amount}
                </Alert>
            )}
        </Paper>
    )
}
