import React, { useEffect, useState } from 'react'
import { Card } from 'primereact/card'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dialog } from 'primereact/dialog'
import api from '../../services/api'

export default function CategoriesList() {
    const [rows, setRows] = useState([])
    const [title, setTitle] = useState('')
    const [editing, setEditing] = useState(null)
    const [editOpen, setEditOpen] = useState(false)

    const load = async () => {
        const { data } = await api.get('/admin/category/all');
        setRows(data)
    }
    useEffect(() => {
        load()
    }, [])

    const add = async () => {
        await api.post('/admin/category/add', { title });
        setTitle('');
        load()
    }

    const update = async () => {
        await api.put(`/admin/category/${editing.id}`, { title: editing.title });
        setEditOpen(false);
        setEditing(null);
        load()
    }

    const remove = async (id) => {
        if (!confirm('Delete category?')) return;
        try {
            await api.delete(`/admin/category/${id}`);
            load()
        } catch (err) {
            console.error(err);
        }
    }

    const actionTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-text" onClick={() => { setEditing({ ...rowData }); setEditOpen(true); }} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => remove(rowData.id)} />
            </div>
        );
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <Card title={<h2 className="m-0">Categories</h2>} className="mb-4">
                <div className="flex gap-2 mb-4 p-fluid">
                    <div className="flex-grow-1">
                        <InputText placeholder="New Category Title" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <Button label="Add" icon="pi pi-plus" onClick={add} disabled={!title} />
                </div>

                <DataTable value={rows} paginator rows={10} className="p-datatable-sm" responsiveLayout="scroll">
                    <Column field="id" header="ID" sortable style={{ width: '100px' }} />
                    <Column field="title" header="Title" sortable filter />
                    <Column header="Actions" body={actionTemplate} style={{ width: '120px', textAlign: 'right' }} />
                </DataTable>
            </Card>

            <Dialog 
                visible={editOpen} 
                onHide={() => { setEditOpen(false); setEditing(null); }} 
                header="Edit Category" 
                modal 
                style={{ width: '350px' }}
                footer={
                    <div className="flex gap-2 justify-content-end">
                        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setEditOpen(false)} />
                        <Button label="Save" icon="pi pi-check" onClick={update} disabled={!editing?.title} />
                    </div>
                }
            >
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="editTitle">Category Title</label>
                        <InputText id="editTitle" autoFocus value={editing?.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                    </div>
                </div>
            </Dialog>
        </div>
    )
}
