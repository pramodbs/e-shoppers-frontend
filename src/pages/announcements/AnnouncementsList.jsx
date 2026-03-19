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

export default function AnnouncementsList() {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({title: '', message: '', active: true})
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const load = async () => {
        const {data} = await api.get('/announcements');
        setRows(data)
    }
    useEffect(() => {
        load()
    }, [])
    const save = async () => {
        if (editing) await api.put(`/admin/announcements/${editing.id}`, form); else await api.post('/admin/announcements', form);
        setOpen(false);
        setEditing(null);
        setForm({title: '', message: '', active: true});
        load()
    }
    const remove = async (id) => {
        if (!confirm('Delete item?')) return;
        await api.delete(`/admin/announcements/${id}`);
        load()
    }
    const paged = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    return (<Paper sx={{p: 2}}><Stack direction='row' justifyContent='space-between' sx={{mb: 2}}><Typography
        variant='h6'>Announcements</Typography><Button startIcon={<Add/>} variant='contained' onClick={() => {
        setEditing(null);
        setForm({title: '', message: '', active: true});
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
                fullWidth><DialogTitle>{editing ? 'Edit' : 'Add'} Announcement</DialogTitle><DialogContent>
            <Stack spacing={2} sx={{mt: 1}}><TextField label='Title' value={form.title} onChange={e => setForm({
                ...form,
                title: e.target.value
            })}/><TextField label='Message' value={form.message}
                            onChange={e => setForm({...form, message: e.target.value})} multiline
                            rows={3}/><FormControlLabel control={<Checkbox checked={!!form.active}
                                                                           onChange={e => setForm({
                                                                               ...form,
                                                                               active: e.target.checked
                                                                           })}/>} label='Active'/><Stack direction='row'
                                                                                                         spacing={1}><Button
                variant='contained' onClick={save}>Save</Button><Button
                onClick={() => setOpen(false)}>Cancel</Button></Stack></Stack>
        </DialogContent></Dialog></Paper>)
}
