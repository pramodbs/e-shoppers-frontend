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

export default function RulesList() {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        name: '',
        trigger: 'PRODUCT_VIEW',
        categoryId: '',
        minSpend: '',
        actionType: 'SEND_OFFER',
        actionRefId: '',
        active: true
    })

    const load = async () => {
        const { data } = await api.get('/admin/rules');
        setRows(data)
    }
    useEffect(() => {
        load()
    }, [])

    const save = async () => {
        try {
            if (editing) await api.put(`/admin/rules/${editing.id}`, form); 
            else await api.post('/admin/rules', form);
            setOpen(false);
            setEditing(null);
            setForm({
                name: '',
                trigger: 'PRODUCT_VIEW',
                categoryId: '',
                minSpend: '',
                actionType: 'SEND_OFFER',
                actionRefId: '',
                active: true
            });
            load()
        } catch (err) {
            console.error(err);
        }
    }

    const remove = async (id) => {
        if (!confirm('Delete item?')) return;
        try {
            await api.delete(`/admin/rules/${id}`);
            load()
        } catch (err) {
            console.error(err);
        }
    }

    const toggle = async (id) => {
        try {
            await api.patch(`/admin/rules/${id}/toggle`);
            load()
        } catch (err) {
            console.error(err);
        }
    }

    const actionTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-power-off" className={`p-button-rounded p-button-text ${rowData.active ? 'p-button-success' : 'p-button-secondary'}`} title="Toggle" onClick={() => toggle(rowData.id)} />
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
            <Card title="Engagement Rules" subTitle="Automate marketing actions based on user behavior" className="mb-4">
                <div className="flex justify-content-end mb-3">
                    <Button label="Add Rule" icon="pi pi-plus" onClick={() => {
                        setEditing(null);
                        setForm({
                            name: '',
                            trigger: 'PRODUCT_VIEW',
                            categoryId: '',
                            minSpend: '',
                            actionType: 'SEND_OFFER',
                            actionRefId: '',
                            active: true
                        });
                        setOpen(true)
                    }} />
                </div>

                <DataTable value={rows} paginator rows={10} className="p-datatable-sm" responsiveLayout="scroll">
                    <Column field="id" header="ID" sortable style={{ width: '80px' }} />
                    <Column field="name" header="Name" sortable filter />
                    <Column field="trigger" header="Trigger" sortable />
                    <Column field="actionType" header="Action" sortable />
                    <Column field="active" header="Active" body={(r) => String(r.active)} sortable style={{ width: '100px' }} />
                    <Column header="Actions" body={actionTemplate} style={{ width: '150px', textAlign: 'right' }} />
                </DataTable>
            </Card>

            <Dialog 
                visible={open} 
                onHide={() => setOpen(false)} 
                header={editing ? 'Edit Rule' : 'Add Rule'} 
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
                        <label htmlFor="ruleName">Name</label>
                        <InputText id="ruleName" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="field mb-3">
                        <label htmlFor="ruleTrigger">Trigger (PRODUCT_VIEW|CART_ADD)</label>
                        <InputText id="ruleTrigger" value={form.trigger} onChange={e => setForm({ ...form, trigger: e.target.value })} />
                    </div>
                    <div className="grid">
                        <div className="col-12 md:col-6 field mb-3">
                            <label htmlFor="ruleCatId">Category ID</label>
                            <InputText id="ruleCatId" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} />
                        </div>
                        <div className="col-12 md:col-6 field mb-3">
                            <label htmlFor="ruleMinSpend">Min Spend</label>
                            <InputNumber id="ruleMinSpend" value={form.minSpend} onValueChange={e => setForm({ ...form, minSpend: e.value })} />
                        </div>
                    </div>
                    <div className="field mb-3">
                        <label htmlFor="ruleAction">Action Type (SEND_OFFER|SEND_AD|...)</label>
                        <InputText id="ruleAction" value={form.actionType} onChange={e => setForm({ ...form, actionType: e.target.value })} />
                    </div>
                    <div className="field mb-3">
                        <label htmlFor="ruleRef">Action Ref ID</label>
                        <InputText id="ruleRef" value={form.actionRefId} onChange={e => setForm({ ...form, actionRefId: e.target.value })} />
                    </div>
                    <div className="field-checkbox flex align-items-center">
                        <Checkbox inputId="ruleActive" checked={!!form.active} onChange={e => setForm({ ...form, active: e.checked })} />
                        <label htmlFor="ruleActive" className="ml-2">Active</label>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

