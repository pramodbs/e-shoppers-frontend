import React,{useState, useEffect} from 'react'
import { Paper, Typography, Stack, TextField, Button, MenuItem, Chip, Select, OutlinedInput, InputLabel, FormControl, Alert, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import api from '../../services/api'
const ROLES = ['ADMIN','USER','DELIVERY','EDITOR']
const HOBBIES = ['reading','music','gaming','travel','fitness']
const INTERESTS = ['tech','shopping','fashion','food','art']
export default function AdminUsers(){
  const [msg,setMsg] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [users, setUsers] = useState([])
  const initialForm = { firstName:'', lastName:'', emailId:'', password:'', phoneNo:'', role:'USER', gender:'', colorPreference:'#7c4dff', hobbies:[], interests:[], street:'', city:'', state:'', country:'', pincode:'' }
  const [form,setForm] = useState(initialForm)
  const onChange = (e)=> setForm({...form,[e.target.name]: e.target.value})
  
  const loadUsers = async () => {
    try {
      const {data} = await api.get('/user/all');
      setUsers(data);
    } catch(err) {
      console.error(err);
    }
  }

  useEffect(() => { loadUsers(); }, [])

  const submit = async()=>{ 
    try{ 
      if(editingId) {
        await api.put(`/user/${editingId}`, form); 
        setMsg('User updated successfully');
        setEditingId(null);
      } else {
        await api.post('/user/register', form); 
        setMsg('User registered successfully'); 
      }
      setForm(initialForm);
      loadUsers();
    }catch(err){ 
      setMsg(err?.response?.data?.error || err?.response?.data || 'Failed to save user') 
    } 
  }

  const editUser = (u) => {
    setEditingId(u.id);
    setForm({
      ...initialForm,
      firstName: u.firstName || '',
      lastName: u.lastName || '',
      emailId: u.emailId || '',
      phoneNo: u.phoneNo || '',
      role: u.roles?.name || 'USER',
      gender: u.gender || '',
      colorPreference: u.colorPreference || '#7c4dff'
    });
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  const deleteUser = async (id) => {
    if(!confirm('Delete this user?')) return;
    try {
      await api.delete(`/user/${id}`);
      loadUsers();
    } catch(err) {
      console.error(err);
    }
  }
  return (
    <Paper sx={{p:2, maxWidth:900, mx: 'auto'}}>
      <Typography variant='h6' sx={{mb:2}}>User Management ({editingId ? 'Edit' : 'Create'})</Typography>
      {msg && <Alert sx={{mb:2}} severity='info'>{msg}</Alert>}
      <Typography variant='subtitle2' sx={{mb:1}}>Basic</Typography>
      <Stack direction='row' spacing={2} sx={{mb:2}}><TextField name='firstName' label='First Name' value={form.firstName} onChange={onChange} fullWidth/><TextField name='lastName' label='Last Name' value={form.lastName} onChange={onChange} fullWidth/></Stack>
      <Stack direction='row' spacing={2} sx={{mb:2}}><TextField name='emailId' label='Email' value={form.emailId} onChange={onChange} fullWidth/><TextField name='phoneNo' label='Phone' value={form.phoneNo} onChange={onChange} fullWidth/></Stack>
      <Stack direction='row' spacing={2} sx={{mb:2}}><TextField name='password' label='Password' type='password' value={form.password} onChange={onChange} fullWidth/><TextField name='gender' label='Gender' value={form.gender} onChange={onChange} fullWidth/></Stack>
      <Stack direction='row' spacing={2} sx={{mb:2}}><TextField name='colorPreference' label='Theme Color' value={form.colorPreference} onChange={onChange} fullWidth/><TextField select name='role' label='Role' value={form.role} onChange={onChange} fullWidth>{ROLES.map(r=> <MenuItem key={r} value={r}>{r}</MenuItem>)}</TextField></Stack>
      <Stack direction='row' spacing={2} sx={{mb:2}}><FormControl fullWidth><InputLabel id='h-l'>Hobbies</InputLabel><Select labelId='h-l' multiple value={form.hobbies} onChange={e=>setForm({...form,hobbies:e.target.value})} input={<OutlinedInput label='Hobbies'/>} renderValue={(sel)=> (<Stack direction='row' spacing={1}>{sel.map(v=> <Chip key={v} label={v}/>)}</Stack>)}>{HOBBIES.map(h=> <MenuItem key={h} value={h}>{h}</MenuItem>)}</Select></FormControl><FormControl fullWidth><InputLabel id='i-l'>Interests</InputLabel><Select labelId='i-l' multiple value={form.interests} onChange={e=>setForm({...form,interests:e.target.value})} input={<OutlinedInput label='Interests'/>} renderValue={(sel)=> (<Stack direction='row' spacing={1}>{sel.map(v=> <Chip key={v} label={v}/>)}</Stack>)}>{INTERESTS.map(h=> <MenuItem key={h} value={h}>{h}</MenuItem>)}</Select></FormControl></Stack>
      <Typography variant='subtitle2' sx={{mb:1}}>Address</Typography>
      <Stack direction='row' spacing={2} sx={{mb:2}}><TextField name='street' label='Street' value={form.street} onChange={onChange} fullWidth/><TextField name='city' label='City' value={form.city} onChange={onChange} fullWidth/></Stack>
      <Stack direction='row' spacing={2} sx={{mb:2}}><TextField name='state' label='State' value={form.state} onChange={onChange} fullWidth/><TextField name='country' label='Country' value={form.country} onChange={onChange} fullWidth/></Stack>
      <Stack direction='row' spacing={2} sx={{mb:2}}><TextField name='pincode' label='Pincode' value={form.pincode} onChange={onChange} fullWidth/></Stack>
      <Stack direction='row' spacing={2} sx={{mb:2}}>
        <Button variant='contained' onClick={submit}>{editingId ? 'Update' : 'Create'} User</Button>
        {editingId && <Button variant='outlined' onClick={() => { setEditingId(null); setForm(initialForm); }}>Cancel</Button>}
      </Stack>

      <Typography variant='h6' sx={{mt:4, mb:2}}>Existing Users</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(u => (
            <TableRow key={u.id}>
              <TableCell>{u.id}</TableCell>
              <TableCell>{u.firstName} {u.lastName}</TableCell>
              <TableCell>{u.emailId}</TableCell>
              <TableCell>{u.roles?.name}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => editUser(u)}><Edit fontSize="small" /></IconButton>
                <IconButton size="small" color="error" onClick={() => deleteUser(u.id)}><Delete fontSize="small" /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}
