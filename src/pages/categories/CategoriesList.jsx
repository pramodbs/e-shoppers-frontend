import React, {useEffect, useState} from 'react'
import {
    Button,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material'
import {Edit, Delete} from '@mui/icons-material'
import api from '../../services/api'

export default function CategoriesList() {
    const [rows, setRows] = useState([])
    const [title, setTitle] = useState('')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [editing, setEditing] = useState(null)
    const [editOpen, setEditOpen] = useState(false)
    const load = async () => {
        const {data} = await api.get('/admin/category/all');
        setRows(data)
    }
    useEffect(() => {
        load()
    }, [])
    const add = async () => {
        await api.post('/admin/category/add', {title});
        setTitle('');
        load()
    }
    const update = async () => {
        await api.put(`/admin/category/${editing.id}`, {title: editing.title});
        setEditOpen(false);
        setEditing(null);
        load()
    }
    const remove = async (id) => {
        if (!confirm('Delete category?')) return;
        await api.delete(`/admin/category/${id}`);
        load()
    }
    const paged = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    return (
        <Paper sx={{p: 2}}><Typography variant='h6' sx={{mb: 2}}>Categories</Typography>
            <Stack direction='row' spacing={1} sx={{mb: 2}}><TextField label='New Category Title' value={title}
                                                                       onChange={e => setTitle(e.target.value)}/><Button
                variant='contained' onClick={add} disabled={!title}>Add</Button></Stack>
            <Table
                size='small'><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Title</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead><TableBody>{paged.map(r => (
                <TableRow
                    key={r.id}><TableCell>{r.id}</TableCell><TableCell>{r.title}</TableCell>
                    <TableCell align="right">
                        <IconButton onClick={() => { setEditing({...r}); setEditOpen(true); }}><Edit/></IconButton>
                        <IconButton color="error" onClick={() => remove(r.id)}><Delete/></IconButton>
                    </TableCell>
                </TableRow>))}</TableBody></Table>
            <TablePagination component='div' count={rows.length} page={page} onPageChange={(e, p) => setPage(p)}
                             rowsPerPage={rowsPerPage} onRowsPerPageChange={e => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0)
            }} rowsPerPageOptions={[5, 10, 25, 50]}/>
            
            <Dialog open={editOpen} onClose={() => { setEditOpen(false); setEditing(null); }} maxWidth="xs" fullWidth>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Category Title" fullWidth value={editing?.title || ''} onChange={(e) => setEditing({...editing, title: e.target.value})} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setEditOpen(false); setEditing(null); }}>Cancel</Button>
                    <Button onClick={update} variant="contained" disabled={!editing?.title}>Save</Button>
                </DialogActions>
            </Dialog>
        </Paper>)
}
