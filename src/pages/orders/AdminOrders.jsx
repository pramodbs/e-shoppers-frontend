import React, {useEffect, useState} from 'react'
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography
} from '@mui/material'
import api from '../../services/api'

const STATUS = ['Delivered', 'On the Way', 'Pending', 'Processing']
const TIMES = ['Morning', 'Afternoon', 'Evening', 'Night', '']
export default function AdminOrders() {
    const [rows, setRows] = useState([])
    const [orderId, setOrderId] = useState('')
    const [dlgUpd, setDlgUpd] = useState(false)
    const [dlgAssign, setDlgAssign] = useState(false)
    const [dlgDetails, setDlgDetails] = useState(false)
    const [selected, setSelected] = useState(null)
    const [upd, setUpd] = useState({
        orderId: '',
        deliveryStatus: 'On the Way',
        deliveryTime: 'Morning',
        deliveryDate: ''
    })
    const [assign, setAssign] = useState({orderId: '', deliveryId: ''})
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const loadAll = async () => {
        const {data} = await api.get('/user/admin/allorder');
        setRows(data)
    }
    const searchById = async () => {
        if (!orderId) return;
        const {data} = await api.get(`/user/admin/showorder`, {params: {orderId}});
        setRows(data)
    }
    useEffect(() => {
        loadAll()
    }, [])
    const openUpd = (oid) => {
        setUpd({orderId: oid, deliveryStatus: 'On the Way', deliveryTime: 'Morning', deliveryDate: ''});
        setDlgUpd(true)
    }
    const openAssign = (oid) => {
        setAssign({orderId: oid, deliveryId: ''});
        setDlgAssign(true)
    }
    const openDetails = (row) => {
        setSelected(row);
        setDlgDetails(true)
    }
    const saveUpd = async () => {
        await api.post('/user/admin/order/deliveryStatus/update', upd);
        setDlgUpd(false);
        (orderId ? searchById() : loadAll())
    }
    const saveAssign = async () => {
        await api.post('/user/admin/order/assignDelivery', assign);
        setDlgAssign(false);
        (orderId ? searchById() : loadAll())
    }
    const paged = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    return (
        <Paper sx={{p: 2}}>
            <Typography variant='h6' sx={{mb: 2}}>Orders (Admin)</Typography>
            <Stack direction='row' spacing={1} sx={{mb: 2}}><TextField label='Search by Order ID' value={orderId}
                                                                       onChange={e => setOrderId(e.target.value)}/><Button
                variant='outlined' onClick={searchById}>Search</Button><Button onClick={() => {
                setOrderId('');
                loadAll()
            }}>Load All</Button></Stack>
            <Table size='small'><TableHead><TableRow><TableCell>Order
                ID</TableCell><TableCell>User</TableCell><TableCell>Product</TableCell><TableCell>Qty</TableCell><TableCell>Total</TableCell><TableCell>Status</TableCell><TableCell>Delivery
                Date</TableCell><TableCell>Delivery Person</TableCell><TableCell
                align='right'>Actions</TableCell></TableRow></TableHead><TableBody>{paged.map(r => (<TableRow
                key={`${r.orderId}-${r.productId}`}><TableCell>{r.orderId}</TableCell><TableCell>{r.userName}</TableCell><TableCell>{r.productName}</TableCell><TableCell>{r.quantity}</TableCell><TableCell>{r.totalPrice}</TableCell><TableCell>{r.deliveryStatus}</TableCell><TableCell>{r.deliveryDate}</TableCell><TableCell>{r.deliveryPersonName}</TableCell><TableCell
                align='right'><Button size='small' onClick={() => openDetails(r)}>View</Button><Button size='small'
                                                                                                       onClick={() => openUpd(r.orderId)}>Update</Button><Button
                size='small' onClick={() => openAssign(r.orderId)}>Assign</Button></TableCell></TableRow>))}</TableBody></Table>
            <TablePagination component='div' count={rows.length} page={page} onPageChange={(e, p) => setPage(p)}
                             rowsPerPage={rowsPerPage} onRowsPerPageChange={e => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0)
            }} rowsPerPageOptions={[5, 10, 25, 50]}/>
            <Dialog open={dlgUpd} onClose={() => setDlgUpd(false)} maxWidth='sm' fullWidth><DialogTitle>Update
                Delivery</DialogTitle><DialogContent>
                <Stack spacing={2} sx={{mt: 1}}><TextField select label='Delivery Status' value={upd.deliveryStatus}
                                                           onChange={e => setUpd({
                                                               ...upd,
                                                               deliveryStatus: e.target.value
                                                           })}>{STATUS.map(s => <MenuItem key={s}
                                                                                          value={s}>{s}</MenuItem>)}</TextField><TextField
                    select label='Delivery Time' value={upd.deliveryTime}
                    onChange={e => setUpd({...upd, deliveryTime: e.target.value})}>{TIMES.map(t => <MenuItem key={t}
                                                                                                             value={t}>{t || 'Default'}</MenuItem>)}</TextField><TextField
                    label='Delivery Date (yyyy-MM-dd)' value={upd.deliveryDate}
                    onChange={e => setUpd({...upd, deliveryDate: e.target.value})}/><Stack direction='row'
                                                                                           spacing={1}><Button
                    variant='contained' onClick={saveUpd}>Save</Button><Button
                    onClick={() => setDlgUpd(false)}>Cancel</Button></Stack></Stack>
            </DialogContent></Dialog>
            <Dialog open={dlgAssign} onClose={() => setDlgAssign(false)} maxWidth='sm' fullWidth><DialogTitle>Assign
                Delivery Person</DialogTitle><DialogContent>
                <Stack spacing={2} sx={{mt: 1}}><TextField label='Order ID' value={assign.orderId}
                                                           onChange={e => setAssign({
                                                               ...assign,
                                                               orderId: e.target.value
                                                           })}/><TextField label='Delivery Person ID'
                                                                           value={assign.deliveryId}
                                                                           onChange={e => setAssign({
                                                                               ...assign,
                                                                               deliveryId: e.target.value
                                                                           })}/><Stack direction='row'
                                                                                       spacing={1}><Button
                    variant='contained' onClick={saveAssign}>Assign</Button><Button
                    onClick={() => setDlgAssign(false)}>Cancel</Button></Stack></Stack>
            </DialogContent></Dialog>
            <Dialog open={dlgDetails} onClose={() => setDlgDetails(false)} maxWidth='md' fullWidth><DialogTitle>Order
                Details</DialogTitle><DialogContent>
                {selected && (<Stack spacing={1} sx={{mt: 1}}>
                    <Typography variant='subtitle2'>Order</Typography>
                    <Stack direction='row' spacing={2}>
                        <div><b>ID:</b> {selected.orderId}</div>
                        <div><b>Date:</b> {selected.orderDate}</div>
                        <div><b>Status:</b> {selected.deliveryStatus}</div>
                    </Stack>
                    <Divider sx={{my: 1}}/>
                    <Typography variant='subtitle2'>Product</Typography>
                    <Stack direction='row' spacing={2}>
                        <div><b>Name:</b> {selected.productName}</div>
                        <div><b>Qty:</b> {selected.quantity}</div>
                        <div><b>Total:</b> {selected.totalPrice}</div>
                    </Stack>
                    <div><b>Description:</b> {selected.productDescription}</div>
                    <Divider sx={{my: 1}}/>
                    <Typography variant='subtitle2'>Customer</Typography>
                    <Stack direction='row' spacing={2}>
                        <div><b>User ID:</b> {selected.userId}</div>
                        <div><b>Name:</b> {selected.userName}</div>
                        <div><b>Phone:</b> {selected.userPhone}</div>
                    </Stack>
                    {selected.address && (<div>
                        <b>Address:</b> {selected.address.street}, {selected.address.city}, {selected.address.state}, {selected.address.country} - {selected.address.pincode}
                    </div>)}
                    <Divider sx={{my: 1}}/>
                    <Typography variant='subtitle2'>Delivery</Typography>
                    <Stack direction='row' spacing={2}>
                        <div><b>Delivery Date:</b> {selected.deliveryDate}</div>
                        <div><b>Delivery Person:</b> {selected.deliveryPersonName || 'PENDING'}</div>
                        <div><b>Contact:</b> {selected.deliveryPersonContact || 'PENDING'}</div>
                    </Stack>
                </Stack>)}
            </DialogContent></Dialog>
        </Paper>
    )
}
