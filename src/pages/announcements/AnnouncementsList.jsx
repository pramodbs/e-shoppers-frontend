import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Card } from 'primereact/card'
import api from '../../services/api'

export default function AnnouncementsList() {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ title: '', message: '', active: true })

    const load = async () => {
        const { data } = await api.get('/announcements');
        setRows(data)
    }
    useEffect(() => {
        load()
    }, [])

    const save = async () => {
        try {
            if (editing) await api.put(`/admin/announcements/${editing.id}`, form); 
            else await api.post('/admin/announcements', form);
            setOpen(false);
            setEditing(null);
            setForm({ title: '', message: '', active: true });
            load()
        } catch (err) {
            console.error(err);
        }
    }

    const remove = async (id) => {
        if (!confirm('Delete item?')) return;
        try {
            await api.delete(`/admin/announcements/${id}`);
            load()
        } catch (err) {
            console.error(err);
        }
    }

    const actionTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-text" onClick={() => {
                    setEditing(rowData);
                    setForm(rowData);
                    setOpen(true)
                }} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => remove(rowData.id)} />
            </div>
        );
    }

    return (
        <div className="p-4">
            <Card title="Announcements" subTitle="Send broadcast messages to users" className="mb-4">
                <div className="flex justify-content-end mb-3">
                    <Button label="Add Announcement" icon="pi pi-plus" onClick={() => {
                        setEditing(null);
                        setForm({ title: '', message: '', active: true });
                        setOpen(true)
                    }} />
                </div>

                <DataTable value={rows} paginator rows={10} className="p-datatable-sm" responsiveLayout="scroll">
                    <Column field="id" header="ID" sortable style={{ width: '80px' }} />
                    <Column field="title" header="Title" sortable filter />
                    <Column field="active" header="Active" body={(r) => String(r.active)} sortable style={{ width: '100px' }} />
                    <Column header="Actions" body={actionTemplate} style={{ width: '120px', textAlign: 'right' }} />
                </DataTable>
            </Card>

            <Dialog 
                visible={open} 
                onHide={() => setOpen(false)} 
                header={editing ? 'Edit Announcement' : 'Add Announcement'} 
                modal 
                style={{ width: '450px' }}
                footer={
                    <div className="flex gap-2 justify-content-end">
                        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setOpen(false)} />
                        <Button label="Save" icon="pi pi-check" onClick={save} />
                    </div>
                }
            >
                <div className="p-fluid">
                    <div className="field mb-3">
                        <label htmlFor="annTitle">Title</label>
                        <InputText id="annTitle" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div className="field mb-3">
                        <label htmlFor="annMsg">Message</label>
                        <InputTextarea id="annMsg" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4} autoResize />
                    </div>
                    <div className="field-checkbox flex align-items-center">
                        <Checkbox inputId="annActive" checked={!!form.active} onChange={e => setForm({ ...form, active: e.checked })} />
                        <label htmlFor="annActive" className="ml-2">Active</label>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

