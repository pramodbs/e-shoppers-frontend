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

export default function AdsList() {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({title: '', content: '', categoryId: '', active: true, imageUrl: '', linkUrl: ''})
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const load = async () => {
        const {data} = await api.get('/admin/ads');
        setRows(data)
    }
    useEffect(() => {
        load()
    }, [])
    const save = async () => {
        if (editing) await api.put(`/admin/ads/${editing.id}`, form); else await api.post('/admin/ads', form);
        setOpen(false);
        setEditing(null);
        setForm({title: '', content: '', categoryId: '', active: true, imageUrl: '', linkUrl: ''});
        load()
    }
    const remove = async (id) => {
        if (!confirm('Delete item?')) return;
        await api.delete(`/admin/ads/${id}`);
        load()
    }
    const paged = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    return (<Paper sx={{p: 2}}><Stack direction='row' justifyContent='space-between' sx={{mb: 2}}><Typography
        variant='h6'>Ads</Typography><Button startIcon={<Add/>} variant='contained' onClick={() => {
        setEditing(null);
        setForm({title: '', content: '', categoryId: '', active: true, imageUrl: '', linkUrl: ''});
        setOpen(true)
    }}>Add</Button></Stack>
        <Table
            size='small'><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Title</TableCell><TableCell>Active</TableCell><TableCell
            align='right'>Actions</TableCell></TableRow></TableHead><TableBody>{paged.map(r => (<TableRow
            key={r.id}><TableCell>{r.id}</TableCell><TableCell>{r.title}</TableCell><TableCell>{String(r.active)}</TableCell><TableCell
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
                fullWidth><DialogTitle>{editing ? 'Edit' : 'Add'} Ad</DialogTitle><DialogContent>
            <Stack spacing={2} sx={{mt: 1}}><TextField label='Title' value={form.title} onChange={e => setForm({
                ...form,
                title: e.target.value
            })}/><TextField label='Content' value={form.content}
                            onChange={e => setForm({...form, content: e.target.value})} multiline rows={3}/><TextField
                label='Category ID' value={form.categoryId}
                onChange={e => setForm({...form, categoryId: e.target.value})}/><FormControlLabel
                control={<Checkbox checked={!!form.active}
                                   onChange={e => setForm({...form, active: e.target.checked})}/>}
                label='Active'/><TextField label='Image URL' value={form.imageUrl || ''}
                                           onChange={e => setForm({...form, imageUrl: e.target.value})}/><TextField
                label='Link URL' value={form.linkUrl || ''}
                onChange={e => setForm({...form, linkUrl: e.target.value})}/><Stack direction='row' spacing={1}><Button
                variant='contained' onClick={save}>Save</Button><Button
                onClick={() => setOpen(false)}>Cancel</Button></Stack></Stack>
        </DialogContent></Dialog></Paper>)
}
