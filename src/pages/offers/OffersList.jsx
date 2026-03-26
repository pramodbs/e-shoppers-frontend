import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Card } from 'primereact/card'
import api from '../../services/api'

export default function OffersList() {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        name: '',
        description: '',
        categoryId: '',
        minSpend: '',
        discountPercent: '',
        active: true
    })

    const load = async () => {
        const { data } = await api.get('/admin/offers');
        setRows(data)
    }
    useEffect(() => {
        load()
    }, [])

    const save = async () => {
        try {
            if (editing) await api.put(`/admin/offers/${editing.id}`, form); 
            else await api.post('/admin/offers', form);
            setOpen(false);
            setEditing(null);
            setForm({ name: '', description: '', categoryId: '', minSpend: '', discountPercent: '', active: true });
            load()
        } catch (err) {
            console.error(err);
        }
    }

    const remove = async (id) => {
        if (!confirm('Delete item?')) return;
        try {
            await api.delete(`/admin/offers/${id}`);
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
            <Card title="Offers" subTitle="Manage promotional discounts" className="mb-4">
                <div className="flex justify-content-end mb-3">
                    <Button label="Add Offer" icon="pi pi-plus" onClick={() => {
                        setEditing(null);
                        setForm({ name: '', description: '', categoryId: '', minSpend: '', discountPercent: '', active: true });
                        setOpen(true)
                    }} />
                </div>

                <DataTable value={rows} paginator rows={10} className="p-datatable-sm" responsiveLayout="scroll">
                    <Column field="id" header="ID" sortable style={{ width: '80px' }} />
                    <Column field="name" header="Name" sortable filter />
                    <Column field="discountPercent" header="Discount %" sortable style={{ width: '120px' }} />
                    <Column field="active" header="Active" body={(r) => String(r.active)} sortable style={{ width: '100px' }} />
                    <Column header="Actions" body={actionTemplate} style={{ width: '120px', textAlign: 'right' }} />
                </DataTable>
            </Card>

            <Dialog 
                visible={open} 
                onHide={() => setOpen(false)} 
                header={editing ? 'Edit Offer' : 'Add Offer'} 
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
                        <label htmlFor="offerName">Name</label>
                        <InputText id="offerName" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="field mb-3">
                        <label htmlFor="offerDesc">Description</label>
                        <InputText id="offerDesc" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div className="field mb-3">
                        <label htmlFor="offerCatId">Category ID</label>
                        <InputText id="offerCatId" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} />
                    </div>
                    <div className="grid">
                        <div className="col-12 md:col-6 field mb-3">
                            <label htmlFor="minSpend">Min Spend</label>
                            <InputNumber id="minSpend" value={form.minSpend} onValueChange={e => setForm({ ...form, minSpend: e.value })} />
                        </div>
                        <div className="col-12 md:col-6 field mb-3">
                            <label htmlFor="discount">Discount %</label>
                            <InputNumber id="discount" value={form.discountPercent} onValueChange={e => setForm({ ...form, discountPercent: e.value })} min={0} max={100} />
                        </div>
                    </div>
                    <div className="field-checkbox flex align-items-center">
                        <Checkbox inputId="offerActive" checked={!!form.active} onChange={e => setForm({ ...form, active: e.checked })} />
                        <label htmlFor="offerActive" className="ml-2">Active</label>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

