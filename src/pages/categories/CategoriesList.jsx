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
    Typography
} from '@mui/material'
import api from '../../services/api'

export default function CategoriesList() {
    const [rows, setRows] = useState([])
    const [title, setTitle] = useState('')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const load = async () => {
        const {data} = await api.get('/category/all');
        setRows(data)
    }
    useEffect(() => {
        load()
    }, [])
    const add = async () => {
        await api.post('/category/add', {title});
        setTitle('');
        load()
    }
    const paged = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    return (
        <Paper sx={{p: 2}}><Typography variant='h6' sx={{mb: 2}}>Categories</Typography>
            <Stack direction='row' spacing={1} sx={{mb: 2}}><TextField label='New Category Title' value={title}
                                                                       onChange={e => setTitle(e.target.value)}/><Button
                variant='contained' onClick={add} disabled={!title}>Add</Button></Stack>
            <Table
                size='small'><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Title</TableCell></TableRow></TableHead><TableBody>{paged.map(r => (
                <TableRow
                    key={r.id}><TableCell>{r.id}</TableCell><TableCell>{r.title}</TableCell></TableRow>))}</TableBody></Table>
            <TablePagination component='div' count={rows.length} page={page} onPageChange={(e, p) => setPage(p)}
                             rowsPerPage={rowsPerPage} onRowsPerPageChange={e => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0)
            }} rowsPerPageOptions={[5, 10, 25, 50]}/>
        </Paper>)
}
