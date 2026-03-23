import React, {useState} from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import api from '../services/api'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'

const ROLES = ['ADMIN', 'USER', 'DELIVERY', 'EDITOR']
const HOBBIES = ['reading', 'music', 'gaming', 'travel', 'fitness', 'cooking', 'photography']
const INTERESTS = ['tech', 'shopping', 'fashion', 'food', 'art', 'sports', 'finance']

export default function Register({ isModal, onSuccess, onSwitchToLogin }) {
    const nav = useNavigate()
    const {login} = useAuth()
    const [msg, setMsg] = useState({type: '', text: ''})
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        firstName: '', lastName: '', emailId: '', password: '', phoneNo: '', role: 'USER',
        gender: 'Male', colorPreference: '#4169E1', hobbies: [], interests: [],
        street: '', city: '', state: '', country: 'IN', pincode: ''
    })

    const onChange = (e) => setForm({...form, [e.target.name]: e.target.value})

    const canSubmit = () => (
        form.firstName && form.lastName && (form.emailId || form.phoneNo) && form.password &&
        form.street && form.city && form.state && form.country && form.pincode
    )

    const submit = async (e) => {
        e.preventDefault()
        if (!canSubmit()) {
            setMsg({type: 'error', text: 'Please fill all required fields'});
            return
        }
        setLoading(true);
        setMsg({type: '', text: ''})
        try {
            // 1) Register
            await api.post('/user/register', form)

            // 2) Auto-login using email (preferred) else phone
            const identifier = form.emailId || form.phoneNo
            const {data} = await api.post('/user/login', {identifier, password: form.password})
            login(data)

            if (onSuccess) {
                onSuccess(data);
                return;
            }

            // 3) Route by role
            const role = data?.role || 'USER'
            if (role === 'ADMIN' || role === 'EDITOR') nav('/admin')
            else if (role === 'DELIVERY') nav('/delivery')
            else nav('/')
        } catch (err) {
            const t = err?.response?.data?.message || err?.response?.data || 'Registration failed'
            setMsg({type: 'error', text: String(t)})
        } finally {
            setLoading(false)
        }
    }

    const formContent = (
        <Box sx={{p: isModal ? 0 : 3}}>
            {!isModal && <Typography variant='h5' gutterBottom>Create Account</Typography>}
            {msg.text && <Alert severity={msg.type || 'info'} sx={{mb: 2}}>{msg.text}</Alert>}

            <Box component='form' onSubmit={submit}>
                <Typography variant='subtitle1' sx={{mt: 1, mb: 1}}>Personal Details</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField name='firstName' label='First Name' value={form.firstName} onChange={onChange}
                                   fullWidth required/>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField name='lastName' label='Last Name' value={form.lastName} onChange={onChange} fullWidth
                                   required/>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField name='emailId' type='email' label='Email' value={form.emailId} onChange={onChange}
                                   fullWidth/>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField name='phoneNo' label='Phone (10 digits)' value={form.phoneNo} onChange={onChange}
                                   fullWidth/>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField name='password' type='password' label='Password' value={form.password}
                                   onChange={onChange} fullWidth required/>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl component='fieldset'>
                            <Typography variant='caption' sx={{mb: 0.5}}>Gender</Typography>
                            <RadioGroup row name='gender' value={form.gender} onChange={onChange}>
                                <FormControlLabel value='Male' control={<Radio/>} label='Male'/>
                                <FormControlLabel value='Female' control={<Radio/>} label='Female'/>
                                <FormControlLabel value='Other' control={<Radio/>} label='Other'/>
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField name='colorPreference' type='color' label='Theme Color' value={form.colorPreference}
                                   onChange={onChange} fullWidth helperText='Pick your UI theme color'/>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField select name='role' label='Role' value={form.role} onChange={onChange} fullWidth>
                            {ROLES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel id='hobbies-lbl'>Hobbies</InputLabel>
                            <Select
                                labelId='hobbies-lbl'
                                multiple value={form.hobbies}
                                onChange={(e) => setForm({...form, hobbies: e.target.value})}
                                input={<OutlinedInput label='Hobbies'/>}
                                renderValue={(sel) => (
                                    <Stack direction='row' gap={1} flexWrap='wrap'>{sel.map(v => <Chip key={v}
                                                                                                       label={v}/>)}</Stack>)}
                            >
                                {HOBBIES.map(h => <MenuItem key={h} value={h}>{h}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel id='interests-lbl'>Interests</InputLabel>
                            <Select
                                labelId='interests-lbl'
                                multiple value={form.interests}
                                onChange={(e) => setForm({...form, interests: e.target.value})}
                                input={<OutlinedInput label='Interests'/>}
                                renderValue={(sel) => (
                                    <Stack direction='row' gap={1} flexWrap='wrap'>{sel.map(v => <Chip key={v}
                                                                                                       label={v}/>)}</Stack>)}
                            >
                                {INTERESTS.map(h => <MenuItem key={h} value={h}>{h}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Typography variant='subtitle1' sx={{mt: 3, mb: 1}}>Address</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField name='street' label='Street' value={form.street} onChange={onChange} fullWidth
                                   required/>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField name='city' label='City' value={form.city} onChange={onChange} fullWidth required/>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField name='state' label='State' value={form.state} onChange={onChange} fullWidth
                                   required/>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField name='country' label='Country' value={form.country} onChange={onChange} fullWidth
                                   required/>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField name='pincode' label='Pincode' value={form.pincode} onChange={onChange} fullWidth
                                   required/>
                    </Grid>
                </Grid>

                <Stack direction='row' spacing={2} sx={{mt: 3}}>
                    <Button type='submit' variant='contained' disabled={loading || !canSubmit()}>Create account</Button>
                    <Button variant='text' onClick={() => onSwitchToLogin ? onSwitchToLogin() : nav('/login')}>Back to Login</Button>
                </Stack>
            </Box>
        </Box>
    );

    return isModal ? formContent : <Paper sx={{maxWidth: 1000, mx: 'auto', mt: 4}}>{formContent}</Paper>;
}
