import React, { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { MultiSelect } from 'primereact/multiselect'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Message } from 'primereact/message'
import api from '../../services/api'

const ROLES = ['ADMIN', 'USER', 'DELIVERY', 'EDITOR']
const HOBBIES = [
    { name: 'Reading', value: 'reading' },
    { name: 'Music', value: 'music' },
    { name: 'Gaming', value: 'gaming' },
    { name: 'Travel', value: 'travel' },
    { name: 'Fitness', value: 'fitness' }
]
const INTERESTS = [
    { name: 'Tech', value: 'tech' },
    { name: 'Shopping', value: 'shopping' },
    { name: 'Fashion', value: 'fashion' },
    { name: 'Food', value: 'food' },
    { name: 'Art', value: 'art' }
]

export default function AdminUsers() {
    const [msg, setMsg] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [users, setUsers] = useState([])
    const initialForm = { firstName: '', lastName: '', emailId: '', password: '', phoneNo: '', role: 'USER', gender: '', colorPreference: '#7c4dff', hobbies: [], interests: [], street: '', city: '', state: '', country: '', pincode: '' }
    const [form, setForm] = useState(initialForm)
    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const loadUsers = async () => {
        try {
            const { data } = await api.get('/user/all');
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => { loadUsers(); }, [])

    const submit = async () => {
        try {
            if (editingId) {
                await api.put(`/user/${editingId}`, form);
                setMsg('User updated successfully');
                setEditingId(null);
            } else {
                await api.post('/user/register', form);
                setMsg('User registered successfully');
            }
            setForm(initialForm);
            loadUsers();
        } catch (err) {
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const deleteUser = async (id) => {
        if (!confirm('Delete this user?')) return;
        try {
            await api.delete(`/user/${id}`);
            loadUsers();
        } catch (err) {
            console.error(err);
        }
    }

    const actionTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-text" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => deleteUser(rowData.id)} />
            </div>
        );
    }

    return (
        <div className="p-4 max-w-5xl mx-auto">
            <Card title={`User Management (${editingId ? 'Edit' : 'Create'})`} className="mb-4">
                {msg && <Message severity="info" text={msg} className="w-full mb-3" />}
                
                <h4 className="mb-2">Basic Information</h4>
                <div className="grid mb-3">
                    <div className="col-12 md:col-6 p-fluid">
                        <label className="block mb-1">First Name</label>
                        <InputText name='firstName' value={form.firstName} onChange={onChange} />
                    </div>
                    <div className="col-12 md:col-6 p-fluid">
                        <label className="block mb-1">Last Name</label>
                        <InputText name='lastName' value={form.lastName} onChange={onChange} />
                    </div>
                </div>

                <div className="grid mb-3">
                    <div className="col-12 md:col-6 p-fluid">
                        <label className="block mb-1">Email</label>
                        <InputText name='emailId' value={form.emailId} onChange={onChange} />
                    </div>
                    <div className="col-12 md:col-6 p-fluid">
                        <label className="block mb-1">Phone</label>
                        <InputText name='phoneNo' value={form.phoneNo} onChange={onChange} />
                    </div>
                </div>

                <div className="grid mb-3">
                    <div className="col-12 md:col-6 p-fluid">
                        <label className="block mb-1">Password</label>
                        <InputText name='password' type='password' value={form.password} onChange={onChange} />
                    </div>
                    <div className="col-12 md:col-6 p-fluid">
                        <label className="block mb-1">Gender</label>
                        <InputText name='gender' value={form.gender} onChange={onChange} />
                    </div>
                </div>

                <div className="grid mb-3">
                    <div className="col-12 md:col-6 p-fluid">
                        <label className="block mb-1">Theme Color</label>
                        <InputText name='colorPreference' value={form.colorPreference} onChange={onChange} />
                    </div>
                    <div className="col-12 md:col-6 p-fluid">
                        <label className="block mb-1">Role</label>
                        <Dropdown name='role' value={form.role} options={ROLES} onChange={onChange} placeholder="Select Role" />
                    </div>
                </div>

                <div className="grid mb-3">
                    <div className="col-12 md:col-6 p-fluid">
                        <label className="block mb-1">Hobbies</label>
                        <MultiSelect value={form.hobbies} options={HOBBIES} onChange={(e) => setForm({...form, hobbies: e.value})} optionLabel="name" display="chip" placeholder="Select Hobbies" />
                    </div>
                    <div className="col-12 md:col-6 p-fluid">
                        <label className="block mb-1">Interests</label>
                        <MultiSelect value={form.interests} options={INTERESTS} onChange={(e) => setForm({...form, interests: e.value})} optionLabel="name" display="chip" placeholder="Select Interests" />
                    </div>
                </div>

                <h4 className="mb-2 mt-4">Address Information</h4>
                <div className="grid mb-3">
                    <div className="col-12 md:col-6 p-fluid">
                        <label className="block mb-1">Street</label>
                        <InputText name='street' value={form.street} onChange={onChange} />
                    </div>
                    <div className="col-12 md:col-6 p-fluid">
                        <label className="block mb-1">City</label>
                        <InputText name='city' value={form.city} onChange={onChange} />
                    </div>
                </div>

                <div className="grid mb-3">
                    <div className="col-12 md:col-6 p-fluid">
                        <label className="block mb-1">State</label>
                        <InputText name='state' value={form.state} onChange={onChange} />
                    </div>
                    <div className="col-12 md:col-6 p-fluid">
                        <label className="block mb-1">Country</label>
                        <InputText name='country' value={form.country} onChange={onChange} />
                    </div>
                </div>
                
                <div className="p-fluid mb-4 w-full md:w-6">
                    <label className="block mb-1">Pincode</label>
                    <InputText name='pincode' value={form.pincode} onChange={onChange} />
                </div>

                <div className="flex gap-2">
                    <Button label={editingId ? 'Update User' : 'Create User'} icon="pi pi-check" onClick={submit} />
                    {editingId && <Button label="Cancel" icon="pi pi-times" className="p-button-outlined" onClick={() => { setEditingId(null); setForm(initialForm); }} />}
                </div>
            </Card>

            <Card title="Existing Users">
                <DataTable value={users} paginator rows={10} className="p-datatable-sm">
                    <Column field="id" header="ID" sortable />
                    <Column header="Name" body={(u) => `${u.firstName} ${u.lastName}`} sortable />
                    <Column field="emailId" header="Email" sortable />
                    <Column field="roles.name" header="Role" sortable />
                    <Column header="Actions" body={actionTemplate} style={{ width: '120px', textAlign: 'right' }} />
                </DataTable>
            </Card>
        </div>
    )
}
