import React,{useState} from 'react'
import { Paper, Typography, Stack, TextField, Button, MenuItem, Chip, Select, OutlinedInput, InputLabel, FormControl, Alert } from '@mui/material'
import api from '../../services/api'
const ROLES = ['ADMIN','USER','DELIVERY','EDITOR']
const HOBBIES = ['reading','music','gaming','travel','fitness']
const INTERESTS = ['tech','shopping','fashion','food','art']
export default function AdminUsers(){
  const [msg,setMsg] = useState('')
  const [form,setForm] = useState({ firstName:'', lastName:'', emailId:'', password:'', phoneNo:'', role:'USER', gender:'', colorPreference:'#7c4dff', hobbies:[], interests:[], street:'', city:'', state:'', country:'', pincode:'' })
  const onChange = (e)=> setForm({...form,[e.target.name]: e.target.value})
  const submit = async()=>{ try{ await api.post('/user/register', form); setMsg('User registered successfully'); }catch(err){ setMsg(err?.response?.data || 'Failed to register user') } }
  return (
    <Paper sx={{p:2, maxWidth:900}}>
      <Typography variant='h6' sx={{mb:2}}>User Management (Create)</Typography>
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
      <Button variant='contained' onClick={submit}>Create User</Button>
    </Paper>
  )
}
