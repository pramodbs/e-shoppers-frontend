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
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import {Add, Delete, Edit} from '@mui/icons-material'
import api from '../../services/api'

export default function OffersList() {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        name: '',
        description: '',
        categoryId: '',
        minSpend: '',
        discountPercent: '',
        active: true
    })
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const load = async () => {
        const {data} = await api.get('/admin/offers');
        setRows(data)
    }
    useEffect(() => {
        load()
    }, [])
    const save = async () => {
        if (editing) await api.put(`/admin/offers/${editing.id}`, form); else await api.post('/admin/offers', form);
        setOpen(false);
        setEditing(null);
        setForm({name: '', description: '', categoryId: '', minSpend: '', discountPercent: '', active: true});
        load()
    }
    const remove = async (id) => {
        if (!confirm('Delete item?')) return;
        await api.delete(`/admin/offers/${id}`);
        load()
    }
    const paged = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    return (<Paper sx={{p: 2}}><Stack direction='row' justifyContent='space-between' sx={{mb: 2}}><Typography
        variant='h6'>Offers</Typography><Button startIcon={<Add/>} variant='contained' onClick={() => {
        setEditing(null);
        setForm({name: '', description: '', categoryId: '', minSpend: '', discountPercent: '', active: true});
        setOpen(true)
    }}>Add</Button></Stack>
        <Table size='small'><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Discount
            %</TableCell><TableCell>Active</TableCell><TableCell
            align='right'>Actions</TableCell></TableRow></TableHead><TableBody>{paged.map(r => (<TableRow
            key={r.id}><TableCell>{r.id}</TableCell><TableCell>{r.name}</TableCell><TableCell>{r.discountPercent}</TableCell><TableCell>{String(r.active)}</TableCell><TableCell
            align='right'><IconButton onClick={() => {
            setEditing(r);
            setForm(r);
            setOpen(true)
        }}><Edit/></IconButton><IconButton color='error' onClick={() => remove(r.id)}><Delete/></IconButton></TableCell></TableRow>))}</TableBody></Table>
        <TablePagination component='div' count={rows.length} page={page} onPageChange={(e, p) => setPage(p)}
                         rowsPerPage={rowsPerPage} onRowsPerPageChange={e => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0)
        }} rowsPerPageOptions={[5, 10, 25, 50]}/>
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth='sm'
                fullWidth><DialogTitle>{editing ? 'Edit' : 'Add'} Offer</DialogTitle><DialogContent>
            <Stack spacing={2} sx={{mt: 1}}><TextField label='Name' value={form.name} onChange={e => setForm({
                ...form,
                name: e.target.value
            })}/><TextField label='Description' value={form.description}
                            onChange={e => setForm({...form, description: e.target.value})}/><TextField
                label='Category ID' value={form.categoryId}
                onChange={e => setForm({...form, categoryId: e.target.value})}/><TextField label='Min Spend'
                                                                                           type='number'
                                                                                           value={form.minSpend}
                                                                                           onChange={e => setForm({
                                                                                               ...form,
                                                                                               minSpend: e.target.value
                                                                                           })}/><TextField
                label='Discount %' type='number' value={form.discountPercent}
                onChange={e => setForm({...form, discountPercent: e.target.value})}/><FormControlLabel
                control={<Checkbox checked={!!form.active}
                                   onChange={e => setForm({...form, active: e.target.checked})}/>}
                label='Active'/><Stack direction='row' spacing={1}><Button variant='contained'
                                                                           onClick={save}>Save</Button><Button
                onClick={() => setOpen(false)}>Cancel</Button></Stack></Stack>
        </DialogContent></Dialog></Paper>)
}
