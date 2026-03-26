import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { InputTextarea } from 'primereact/inputtextarea'
import { Checkbox } from 'primereact/checkbox'
import { Card } from 'primereact/card'
import api from '../../services/api'

export default function AdminProducts() {
    const [rows, setRows] = useState([])
    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: 0,
        imageName: '',
        categoryId: '',
        active: true,
        quantity: 0
    })

    const load = async () => {
        const { data } = await api.get('/admin/product');
        setRows(data)
    }
    useEffect(() => {
        load()
    }, [])

    const save = async () => {
        const body = {
            title: form.title,
            description: form.description,
            price: Number(form.price),
            imageName: form.imageName,
            categoryId: form.categoryId ? Number(form.categoryId) : null,
            active: form.active,
            quantity: Number(form.quantity)
        }
        try {
            if (editing) await api.put(`/admin/product/${editing.id}`, body)
            else await api.post('/admin/product', body)
            setOpen(false);
            setEditing(null);
            setForm({ title: '', description: '', price: 0, imageName: '', categoryId: '', active: true, quantity: 0 });
            load()
        } catch (err) {
            console.error(err);
        }
    }
    const remove = async (id) => {
        if (!confirm('Delete product?')) return;
        try {
            await api.delete(`/admin/product/${id}`);
            load()
        } catch (err) {
            console.error(err);
        }
    }

    const actionTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button aria-label="edit" icon="pi pi-pencil" className="p-button-rounded p-button-text" onClick={() => {
                    setEditing(rowData);
                    setForm({ ...rowData, categoryId: rowData.category?.id || rowData.categoryId || '' });
                    setOpen(true);
                }} />
                <Button aria-label="delete" icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => remove(rowData.id)} />
            </div>
        );
    }

    return (
        <div className="p-4">
            <Card title={<h2 className="m-0">Products</h2>} subTitle="Manage your store products" className="mb-4">
                <div className="flex justify-content-end mb-3">
                    <Button label="Add Product" icon="pi pi-plus" onClick={() => {
                        setEditing(null);
                        setForm({ title: '', description: '', price: 0, imageName: '', categoryId: '', active: true, quantity: 0 });
                        setOpen(true)
                    }} />
                </div>

                <DataTable value={rows} paginator rows={10} className="p-datatable-sm" responsiveLayout="scroll">
                    <Column field="id" header="ID" sortable />
                    <Column field="title" header="Title" sortable filter />
                    <Column field="price" header="Price" sortable body={(r) => `₹${r.price}`} />
                    <Column field="quantity" header="Qty" sortable />
                    <Column field="active" header="Active" body={(r) => String(r.active)} sortable />
                    <Column header="Actions" body={actionTemplate} style={{ width: '120px', textAlign: 'right' }} />
                </DataTable>
            </Card>

            <Dialog 
                visible={open} 
                onHide={() => { setOpen(false); setEditing(null); }} 
                header={editing ? 'Edit Product' : 'Add Product'} 
                modal 
                style={{ width: '50vw' }}
                breakpoints={{ '960px': '75vw', '641px': '100vw' }}
                footer={
                    <div className="flex gap-2 justify-content-end">
                        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setOpen(false)} />
                        <Button label="Save" icon="pi pi-check" onClick={save} />
                    </div>
                }
            >
                <div className="p-fluid">
                    <div className="field mb-3">
                        <label htmlFor="title">Title</label>
                        <InputText id="title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div className="field mb-3">
                        <label htmlFor="description">Description</label>
                        <InputTextarea id="description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} autoResize />
                    </div>
                    <div className="grid">
                        <div className="col-12 md:col-6 field mb-3">
                            <label htmlFor="price">Price</label>
                            <InputNumber inputId="price" value={form.price} onValueChange={e => setForm({ ...form, price: e.value })} mode="currency" currency="INR" locale="en-IN" />
                        </div>
                        <div className="col-12 md:col-6 field mb-3">
                            <label htmlFor="quantity">Quantity</label>
                            <InputNumber id="quantity" value={form.quantity} onValueChange={e => setForm({ ...form, quantity: e.value })} />
                        </div>
                    </div>
                    <div className="field mb-3">
                        <label htmlFor="imageName">Image Name (URL)</label>
                        <InputText id="imageName" value={form.imageName} onChange={e => setForm({ ...form, imageName: e.target.value })} />
                    </div>
                    <div className="field mb-3">
                        <label htmlFor="categoryId">Category ID</label>
                        <InputText id="categoryId" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} />
                    </div>
                    <div className="field-checkbox mb-3 flex align-items-center">
                        <Checkbox inputId="active" checked={!!form.active} onChange={e => setForm({ ...form, active: e.checked })} />
                        <label htmlFor="active" className="ml-2">Active</label>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}
