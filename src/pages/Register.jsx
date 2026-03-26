import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { RadioButton } from 'primereact/radiobutton'
import { Dropdown } from 'primereact/dropdown'
import { MultiSelect } from 'primereact/multiselect'
import { Message } from 'primereact/message'
import { Card } from 'primereact/card'
import { ColorPicker } from 'primereact/colorpicker'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLES = ['ADMIN', 'USER', 'DELIVERY', 'EDITOR']
const HOBBIES = [
    { label: 'Reading', value: 'reading' },
    { label: 'Music', value: 'music' },
    { label: 'Gaming', value: 'gaming' },
    { label: 'Travel', value: 'travel' },
    { label: 'Fitness', value: 'fitness' },
    { label: 'Cooking', value: 'cooking' },
    { label: 'Photography', value: 'photography' }
]
const INTERESTS = [
    { label: 'Tech', value: 'tech' },
    { label: 'Shopping', value: 'shopping' },
    { label: 'Fashion', value: 'fashion' },
    { label: 'Food', value: 'food' },
    { label: 'Art', value: 'art' },
    { label: 'Sports', value: 'sports' },
    { label: 'Finance', value: 'finance' }
]

export default function Register({ isModal, onSuccess, onSwitchToLogin }) {
    const nav = useNavigate()
    const { login } = useAuth()
    const [msg, setMsg] = useState({ type: '', text: '' })
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        firstName: '', lastName: '', emailId: '', password: '', phoneNo: '', role: 'USER',
        gender: 'Male', colorPreference: '4169E1', hobbies: [], interests: [],
        street: '', city: '', state: '', country: 'IN', pincode: ''
    })

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const canSubmit = () => (
        form.firstName && form.lastName && (form.emailId || form.phoneNo) && form.password &&
        form.street && form.city && form.state && form.country && form.pincode
    )

    const submit = async (e) => {
        e.preventDefault()
        if (!canSubmit()) {
            setMsg({ type: 'warn', text: 'Please fill all required fields' });
            return
        }
        setLoading(true);
        setMsg({ type: '', text: '' })
        try {
            const regForm = { ...form, colorPreference: '#' + form.colorPreference };
            await api.post('/user/register', regForm)

            const identifier = form.emailId || form.phoneNo
            const { data } = await api.post('/user/login', { identifier, password: form.password })
            login(data)

            if (onSuccess) {
                onSuccess(data);
                return;
            }

            nav('/')
        } catch (err) {
            const t = err?.response?.data?.message || err?.response?.data || 'Registration failed'
            setMsg({ type: 'error', text: String(t) })
        } finally {
            setLoading(false)
        }
    }

    const formContent = (
        <div className={isModal ? 'p-0' : 'p-3'}>
            {!isModal && <h2 className="text-3xl font-bold mb-4">Create Account</h2>}
            {msg.text && <Message severity={msg.type || 'info'} text={msg.text} className="w-full mb-3" />}

            <form onSubmit={submit} className="p-fluid">
                <h3 className="text-xl font-semibold mb-3 border-bottom-1 border-gray-200 pb-2">Personal Details</h3>
                <div className="grid">
                    <div className="col-12 md:col-6 field mb-3">
                        <label>First Name*</label>
                        <InputText name="firstName" value={form.firstName} onChange={onChange} required />
                    </div>
                    <div className="col-12 md:col-6 field mb-3">
                        <label>Last Name*</label>
                        <InputText name="lastName" value={form.lastName} onChange={onChange} required />
                    </div>
                    <div className="col-12 md:col-6 field mb-3">
                        <label>Email</label>
                        <InputText name="emailId" type="email" value={form.emailId} onChange={onChange} />
                    </div>
                    <div className="col-12 md:col-6 field mb-3">
                        <label>Phone (10 digits)</label>
                        <InputText name="phoneNo" value={form.phoneNo} onChange={onChange} />
                    </div>
                    <div className="col-12 md:col-6 field mb-3">
                        <label>Password*</label>
                        <InputText name="password" type="password" value={form.password} onChange={onChange} required />
                    </div>
                    <div className="col-12 md:col-6 field mb-3">
                        <label className="block mb-2">Gender</label>
                        <div className="flex gap-4">
                            <div className="flex align-items-center">
                                <RadioButton inputId="g1" name="gender" value="Male" onChange={onChange} checked={form.gender === 'Male'} />
                                <label htmlFor="g1" className="ml-2">Male</label>
                            </div>
                            <div className="flex align-items-center">
                                <RadioButton inputId="g2" name="gender" value="Female" onChange={onChange} checked={form.gender === 'Female'} />
                                <label htmlFor="g2" className="ml-2">Female</label>
                            </div>
                            <div className="flex align-items-center">
                                <RadioButton inputId="g3" name="gender" value="Other" onChange={onChange} checked={form.gender === 'Other'} />
                                <label htmlFor="g3" className="ml-2">Other</label>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 md:col-6 field mb-3">
                        <label className="block mb-1">Theme Color Preference</label>
                        <div className="flex align-items-center gap-2">
                            <ColorPicker value={form.colorPreference} onChange={(e) => setForm({ ...form, colorPreference: e.value })} />
                            <span>Pick a brand color</span>
                        </div>
                    </div>
                    <div className="col-12 md:col-6 field mb-3">
                        <label>Role</label>
                        <Dropdown name="role" value={form.role} options={ROLES} onChange={onChange} placeholder="Select Role" />
                    </div>
                    <div className="col-12 md:col-6 field mb-3">
                        <label>Hobbies</label>
                        <MultiSelect value={form.hobbies} options={HOBBIES} onChange={(e) => setForm({ ...form, hobbies: e.value })} placeholder="Select Hobbies" display="chip" />
                    </div>
                    <div className="col-12 md:col-6 field mb-3">
                        <label>Interests</label>
                        <MultiSelect value={form.interests} options={INTERESTS} onChange={(e) => setForm({ ...form, interests: e.value })} placeholder="Select Interests" display="chip" />
                    </div>
                </div>

                <h3 className="text-xl font-semibold mb-3 mt-4 border-bottom-1 border-gray-200 pb-2">Address</h3>
                <div className="grid">
                    <div className="col-12 field mb-3">
                        <label>Street*</label>
                        <InputText name="street" value={form.street} onChange={onChange} required />
                    </div>
                    <div className="col-12 md:col-4 field mb-3">
                        <label>City*</label>
                        <InputText name="city" value={form.city} onChange={onChange} required />
                    </div>
                    <div className="col-12 md:col-4 field mb-3">
                        <label>State*</label>
                        <InputText name="state" value={form.state} onChange={onChange} required />
                    </div>
                    <div className="col-12 md:col-4 field mb-3">
                        <label>Country*</label>
                        <InputText name="country" value={form.country} onChange={onChange} required />
                    </div>
                    <div className="col-12 md:col-4 field mb-3">
                        <label>Pincode*</label>
                        <InputText name="pincode" value={form.pincode} onChange={onChange} required />
                    </div>
                </div>

                <div className="flex gap-3 mt-4">
                    <Button type="submit" label="Create Account" icon="pi pi-user-plus" loading={loading} disabled={!canSubmit()} className="p-3" />
                    <Button type="button" label="Back to Login" className="p-button-text" onClick={() => onSwitchToLogin ? onSwitchToLogin() : nav('/login')} />
                </div>
            </form>
        </div>
    );

    return isModal ? formContent : (
        <div className="flex justify-content-center mt-4">
            <Card style={{ maxWidth: '1000px', width: '95%' }}>
                {formContent}
            </Card>
        </div>
    );
}
