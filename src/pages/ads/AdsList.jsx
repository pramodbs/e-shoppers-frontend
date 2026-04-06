import React, { useEffect, useState, useRef } from 'react'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Card } from 'primereact/card'
import api from '../../services/api'

export default function AdsList() {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [form, setForm] = useState({ title: '', content: '', categoryId: '', active: true, imageUrl: '', linkUrl: '' })

    const load = async () => {
        const { data } = await api.get('/admin/ads');
        setRows(data)
    }
    useEffect(() => {
        load()
    }, [])

    const save = async () => {
        try {
            const payload = { ...form, categoryId: form.categoryId ? parseInt(form.categoryId, 10) : null };
            if (editing) {
                await api.put(`/admin/ads/${editing.id}`, payload);
            } else {
                await api.post('/admin/ads', payload);
            }
            setOpen(false);
            setEditing(null);
            setForm({ title: '', content: '', categoryId: '', active: true, imageUrl: '', linkUrl: '' });
            load();
        } catch (err) {
            console.error("Save failed", err);
        }
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const { data } = await api.post('/admin/ads/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setForm(prev => ({ ...prev, imageUrl: data.url }));
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setUploading(false);
        }
    };

    const remove = async (id) => {
        if (!confirm('Delete item?')) return;
        try {
            await api.delete(`/admin/ads/${id}`);
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
            <Card title={<h2 className="m-0">Ads</h2>} subTitle="Manage store marketing banners" className="mb-4">
                <div className="flex justify-content-end mb-3">
                    <Button label="Add Advertisement" icon="pi pi-plus" onClick={() => {
                        setEditing(null);
                        setForm({ title: '', content: '', categoryId: '', active: true, imageUrl: '', linkUrl: '' });
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
                header={editing ? 'Edit Advertisement' : 'Add Advertisement'} 
                modal 
                style={{ width: '500px' }}
                footer={
                    <div className="flex gap-2 justify-content-end">
                        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setOpen(false)} />
                        <Button label="Save" icon="pi pi-check" onClick={save} />
                    </div>
                }
            >
                <div className="p-fluid">
                    <div className="field mb-3">
                        <label htmlFor="adTitle">Title</label>
                        <InputText id="adTitle" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div className="field mb-3">
                        <label htmlFor="adContent">Content</label>
                        <InputTextarea id="adContent" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={3} autoResize />
                    </div>
                    <div className="field mb-3">
                        <label htmlFor="adCatId">Category ID</label>
                        <InputText id="adCatId" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} />
                    </div>
                    <div className="field mb-3">
                        <label htmlFor="adImg">Image URL</label>
                        <div className="flex gap-2 mb-2">
                            <InputText id="adImg" value={form.imageUrl || ''} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="External URL or uploaded path" />
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                style={{ display: 'none' }} 
                                accept="image/*" 
                                onChange={handleFileUpload} 
                            />
                            <Button 
                                type="button" 
                                icon="pi pi-upload" 
                                className="p-button-outlined" 
                                onClick={() => fileInputRef.current.click()} 
                                loading={uploading}
                                tooltip="Upload local image"
                            />
                        </div>
                        {form.imageUrl && (
                            <div className="mt-2 flex justify-content-center border-1 border-300 border-round p-2" style={{ backgroundColor: 'var(--surface-ground)' }}>
                                <img 
                                    src={form.imageUrl} 
                                    alt="Preview" 
                                    className="max-h-10rem object-contain" 
                                    onError={(e) => { e.target.src = 'https://placehold.co/400x200?text=Invalid+Image+URL'; e.target.onerror = null; }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="field mb-3">
                        <label htmlFor="adLink">Link URL</label>
                        <InputText id="adLink" value={form.linkUrl || ''} onChange={e => setForm({ ...form, linkUrl: e.target.value })} />
                    </div>
                    <div className="field-checkbox flex align-items-center">
                        <Checkbox inputId="adActive" checked={!!form.active} onChange={e => setForm({ ...form, active: e.checked })} />
                        <label htmlFor="adActive" className="ml-2">Active</label>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}
