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

export default function CartPage() {
    const [userId, setUserId] = useState('')
    const [items, setItems] = useState([])
    const [total, setTotal] = useState('0')
    const [msg, setMsg] = useState('')

    const load = async () => {
        if (!userId) {
            setMsg('Enter User ID');
            return
        }
        setMsg('')
        const {data} = await api.get('/user/myCart', {params: {userId}})
        setItems(data.cartData || [])
        setTotal(data.totalCartPrice || '0')
    }

    const removeItem = async (id) => {
        await api.delete(`/user/cart/${id}`);
        load()
    }

    return (
        <Paper sx={{p: 2}}>
            <Typography variant='h6' sx={{mb: 2}}>My Cart</Typography>
            {msg && <Alert severity='info' sx={{mb: 2}}>{msg}</Alert>}
            <Stack direction='row' spacing={1} sx={{mb: 2}}>
                <TextField label='User ID' value={userId} onChange={e => setUserId(e.target.value)}/>
                <Button variant='contained' onClick={load}>Load</Button>
            </Stack>

            <Table size='small'>
                <TableHead><TableRow><TableCell>#</TableCell><TableCell>Product</TableCell><TableCell>Qty</TableCell><TableCell>Price</TableCell></TableRow></TableHead>
                <TableBody>{items.map((it, idx) => (
                    <TableRow key={it.cartId}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{it.productName}</TableCell>
                        <TableCell>{it.quantity}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell align='right'><Button size='small' color='error'
                                                         onClick={() => removeItem(it.cartId)}>Remove</Button></TableCell>
                    </TableRow>
                ))}</TableBody>
            </Table>

            <Stack direction='row' justifyContent='space-between' sx={{mt: 2}}>
                <Typography variant='subtitle1'>Total: {total}</Typography>
                <Button variant='contained' href={`/checkout?userId=${userId}`}>Checkout</Button>
            </Stack>
        </Paper>
    )
}
