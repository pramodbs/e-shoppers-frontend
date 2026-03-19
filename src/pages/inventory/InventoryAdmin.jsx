import React, {useEffect, useState} from 'react'
import {
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

export default function InventoryAdmin() {
    const [rows, setRows] = useState([])
    const [delta, setDelta] = useState('')
    const [reason, setReason] = useState('Manual adjustment')
    const [pid, setPid] = useState('')

    const load = async () => {
        const {data} = await api.get('/admin/inventory/stock');
        setRows(data)
    }
    useEffect(() => {
        load()
    }, [])

    const adjust = async () => {
        await api.post('/admin/inventory/adjust', {productId: Number(pid), delta: Number(delta), reason});
        setDelta('');
        setPid('');
        load()
    }

    return (
        <Paper sx={{p: 2}}>
            <Typography variant='h6' sx={{mb: 2}}>Inventory</Typography>

            <Stack direction='row' spacing={1} sx={{mb: 2}}>
                <TextField label='Product ID' value={pid} onChange={e => setPid(e.target.value)}/>
                <TextField label='Delta (+/-)' value={delta} onChange={e => setDelta(e.target.value)}/>
                <TextField label='Reason' value={reason} onChange={e => setReason(e.target.value)}/>
                <Button variant='contained' onClick={adjust} disabled={!pid || !delta}>Apply</Button>
            </Stack>

            <Table size='small'>
                <TableHead><TableRow><TableCell>ID</TableCell><TableCell>Title</TableCell><TableCell>Stock</TableCell></TableRow></TableHead>
                <TableBody>{rows.map(r => (
                    <TableRow
                        key={r.id}><TableCell>{r.id}</TableCell><TableCell>{r.title}</TableCell><TableCell>{r.quantity}</TableCell></TableRow>
                ))}</TableBody>
            </Table>
        </Paper>
    )
}
