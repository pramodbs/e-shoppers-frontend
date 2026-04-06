import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import api from '../../services/api';

export default function StoreroomsList() {
    const [storerooms, setStorerooms] = useState([]);
    const [storeroom, setStoreroom] = useState({ name: '', location: '' });
    const [dialogVisible, setDialogVisible] = useState(false);
    const toast = React.useRef(null);

    const loadStorerooms = async () => {
        try {
            const { data } = await api.get('/logistics/storeroom/all');
            setStorerooms(data);
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load storerooms' });
        }
    };

    useEffect(() => {
        loadStorerooms();
    }, []);

    const saveStoreroom = async () => {
        try {
            if (storeroom.id) {
                await api.put(`/logistics/storeroom/${storeroom.id}`, storeroom);
            } else {
                await api.post('/logistics/storeroom/add', storeroom);
            }
            setDialogVisible(false);
            setStoreroom({ name: '', location: '' });
            loadStorerooms();
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Storeroom saved' });
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to save storeroom' });
        }
    };

    const deleteStoreroom = async (id) => {
        try {
            await api.delete(`/logistics/storeroom/${id}`);
            loadStorerooms();
            toast.current.show({ severity: 'success', summary: 'Deleted', detail: 'Storeroom removed' });
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete storeroom' });
        }
    };

    const editStoreroom = (s) => {
        setStoreroom({ ...s });
        setDialogVisible(true);
    };

    const actionTemplate = (rowData) => (
        <div className="flex gap-2">
            <Button icon="pi pi-pencil" className="p-button-text p-button-sm" onClick={() => editStoreroom(rowData)} />
            <Button icon="pi pi-trash" className="p-button-text p-button-danger p-button-sm" onClick={() => deleteStoreroom(rowData.id)} />
        </div>
    );

    return (
        <div className="p-4">
            <Toast ref={toast} />
            <Card title="Manage Storerooms" className="shadow-2">
                <div className="mb-4">
                    <Button label="New Storeroom" icon="pi pi-plus" onClick={() => { setStoreroom({ name: '', location: '' }); setDialogVisible(true); }} />
                </div>

                <DataTable value={storerooms} paginator rows={10} className="p-datatable-sm" responsiveLayout="scroll">
                    <Column field="id" header="ID" sortable />
                    <Column field="name" header="Name" sortable filter />
                    <Column field="location" header="Location" />
                    <Column body={actionTemplate} header="Actions" style={{ width: '100px' }} />
                </DataTable>
            </Card>

            <Dialog header={storeroom.id ? "Edit Storeroom" : "Add New Storeroom"} visible={dialogVisible} style={{ width: '450px' }} onHide={() => setDialogVisible(false)}>
                <div className="flex flex-column gap-3 p-fluid">
                    <div>
                        <label htmlFor="name" className="block font-bold mb-1">Storeroom Name</label>
                        <InputText id="name" value={storeroom.name} onChange={(e) => setStoreroom({ ...storeroom, name: e.target.value })} autoFocus />
                    </div>
                    <div>
                        <label htmlFor="location" className="block font-bold mb-1">Location</label>
                        <InputText id="location" value={storeroom.location} onChange={(e) => setStoreroom({ ...storeroom, location: e.target.value })} />
                    </div>
                    <div className="mt-2">
                        <Button label="Save" icon="pi pi-check" onClick={saveStoreroom} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
