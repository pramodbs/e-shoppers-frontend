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
import {Add, Delete, Edit, ToggleOn} from '@mui/icons-material'
import api from '../../services/api'

export default function RulesList() {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        name: '',
        trigger: 'PRODUCT_VIEW',
        categoryId: '',
        minSpend: '',
        actionType: 'SEND_OFFER',
        actionRefId: '',
        active: true
    })
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const load = async () => {
        const {data} = await api.get('/admin/rules');
        setRows(data)
    }
    useEffect(() => {
        load()
    }, [])
    const save = async () => {
        if (editing) await api.put(`/admin/rules/${editing.id}`, form); else await api.post('/admin/rules', form);
        setOpen(false);
        setEditing(null);
        setForm({
            name: '',
            trigger: 'PRODUCT_VIEW',
            categoryId: '',
            minSpend: '',
            actionType: 'SEND_OFFER',
            actionRefId: '',
            active: true
        });
        load()
    }
    const remove = async (id) => {
        if (!confirm('Delete item?')) return;
        await api.delete(`/admin/rules/${id}`);
        load()
    }
    const toggle = async (id) => {
        await api.patch(`/admin/rules/${id}/toggle`);
        load()
    }
    const paged = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    return (<Paper sx={{p: 2}}><Stack direction='row' justifyContent='space-between' sx={{mb: 2}}><Typography
        variant='h6'>Rules</Typography><Button startIcon={<Add/>} variant='contained' onClick={() => {
        setEditing(null);
        setForm({
            name: '',
            trigger: 'PRODUCT_VIEW',
            categoryId: '',
            minSpend: '',
            actionType: 'SEND_OFFER',
            actionRefId: '',
            active: true
        });
        setOpen(true)
    }}>Add</Button></Stack>
        <Table
            size='small'><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Trigger</TableCell><TableCell>Action</TableCell><TableCell>Active</TableCell><TableCell
            align='right'>Actions</TableCell></TableRow></TableHead><TableBody>{paged.map(r => (<TableRow
            key={r.id}><TableCell>{r.id}</TableCell><TableCell>{r.name}</TableCell><TableCell>{r.trigger}</TableCell><TableCell>{r.actionType}</TableCell><TableCell>{String(r.active)}</TableCell><TableCell
            align='right'><IconButton color='primary' title='Toggle'
                                      onClick={() => toggle(r.id)}><ToggleOn/></IconButton><IconButton onClick={() => {
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
                fullWidth><DialogTitle>{editing ? 'Edit' : 'Add'} Rule</DialogTitle><DialogContent>
            <Stack spacing={2} sx={{mt: 1}}><TextField label='Name' value={form.name} onChange={e => setForm({
                ...form,
                name: e.target.value
            })}/><TextField label='Trigger (PRODUCT_VIEW|CART_ADD)' value={form.trigger}
                            onChange={e => setForm({...form, trigger: e.target.value})}/><TextField label='Category ID'
                                                                                                    value={form.categoryId}
                                                                                                    onChange={e => setForm({
                                                                                                        ...form,
                                                                                                        categoryId: e.target.value
                                                                                                    })}/><TextField
                label='Min Spend' type='number' value={form.minSpend}
                onChange={e => setForm({...form, minSpend: e.target.value})}/><TextField
                label='Action Type (SEND_OFFER|SEND_AD|SEND_ANNOUNCEMENT)' value={form.actionType}
                onChange={e => setForm({...form, actionType: e.target.value})}/><TextField label='Action Ref ID'
                                                                                           value={form.actionRefId}
                                                                                           onChange={e => setForm({
                                                                                               ...form,
                                                                                               actionRefId: e.target.value
                                                                                           })}/><FormControlLabel
                control={<Checkbox checked={!!form.active}
                                   onChange={e => setForm({...form, active: e.target.checked})}/>}
                label='Active'/><Stack direction='row' spacing={1}><Button variant='contained'
                                                                           onClick={save}>Save</Button><Button
                onClick={() => setOpen(false)}>Cancel</Button></Stack></Stack>
        </DialogContent></Dialog></Paper>)
}
