import React, {useEffect, useState} from 'react'
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
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
import {Add, Delete, Edit} from '@mui/icons-material'
import api from '../../services/api'

export default function AdminProducts() {
    const [rows, setRows] = useState([])
    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '0',
        imageName: '',
        categoryId: '',
        active: true,
        quantity: 0
    })

    const load = async () => {
        const {data} = await api.get('/admin/product');
        setRows(data)
    }
    useEffect(() => {
        load()
    }, [])

    const save = async () => {
        const body = {
            title: form.title,
            description: form.description,
            price: Number(form.price),
            imageName: form.imageName,
            categoryId: form.categoryId ? Number(form.categoryId) : null
        }
        if (editing) await api.put(`/admin/product/${editing.id}`, body)
        else await api.post('/admin/product', body)
        setOpen(false);
        setEditing(null);
        setForm({title: '', description: '', price: '0', imageName: '', categoryId: '', active: true, quantity: 0});
        load()
    }
    const remove = async (id) => {
        if (!confirm('Delete product?')) return;
        await api.delete(`/admin/product/${id}`);
        load()
    }

    return (
        <Paper sx={{p: 2}}>
            <Stack direction='row' justifyContent='space-between' sx={{mb: 2}}>
                <Typography variant='h6'>Products</Typography>
                <Button startIcon={<Add/>} variant='contained' onClick={() => {
                    setEditing(null);
                    setOpen(true)
                }}>Add</Button>
            </Stack>

            <Table size='small'>
                <TableHead><TableRow>
                    <TableCell>ID</TableCell><TableCell>Title</TableCell><TableCell>Price</TableCell><TableCell>Qty</TableCell><TableCell>Active</TableCell><TableCell
                    align='right'>Actions</TableCell>
                </TableRow></TableHead>
                <TableBody>{rows.map(r => (
                    <TableRow key={r.id}>
                        <TableCell>{r.id}</TableCell>
                        <TableCell>{r.title}</TableCell>
                        <TableCell>{r.price}</TableCell>
                        <TableCell>{r.quantity}</TableCell>
                        <TableCell>{String(r.active)}</TableCell>
                        <TableCell align='right'>
                            <IconButton onClick={() => {
                                setEditing(r);
                                setForm({...r, price: String(r.price || 0), categoryId: r.category?.id || r.categoryId})
                            }}><Edit/></IconButton>
                            <IconButton color='error' onClick={() => remove(r.id)}><Delete/></IconButton>
                        </TableCell>
                    </TableRow>
                ))}</TableBody>
            </Table>

            <Dialog open={open || !!editing} onClose={() => {
                setOpen(false);
                setEditing(null)
            }} maxWidth='sm' fullWidth>
                <DialogTitle>{editing ? 'Edit' : 'Add'} Product</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{mt: 1}}>
                        <TextField label='Title' value={form.title}
                                   onChange={e => setForm({...form, title: e.target.value})}/>
                        <TextField label='Description' value={form.description}
                                   onChange={e => setForm({...form, description: e.target.value})} multiline rows={3}/>
                        <TextField label='Price' type='number' value={form.price}
                                   onChange={e => setForm({...form, price: e.target.value})}/>
                        <TextField label='Image Name' value={form.imageName}
                                   onChange={e => setForm({...form, imageName: e.target.value})}/>
                        <TextField label='Category ID' value={form.categoryId}
                                   onChange={e => setForm({...form, categoryId: e.target.value})}/>
                        <FormControlLabel control={<Checkbox checked={!!form.active} onChange={e => setForm({
                            ...form,
                            active: e.target.checked
                        })}/>} label='Active'/>
                        <Stack direction='row' spacing={1}><Button variant='contained'
                                                                   onClick={save}>Save</Button><Button onClick={() => {
                            setOpen(false);
                            setEditing(null)
                        }}>Cancel</Button></Stack>
                    </Stack>
                </DialogContent>
            </Dialog>
        </Paper>
    )
}
