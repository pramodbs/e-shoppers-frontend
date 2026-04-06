import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import api from '../../services/api';

export default function SellersList() {
    const [sellers, setSellers] = useState([]);
    const [seller, setSeller] = useState({ name: '', emailId: '', phoneNo: '', address: '', rating: 0 });
    const [dialogVisible, setDialogVisible] = useState(false);
    const toast = React.useRef(null);

    const loadSellers = async () => {
        try {
            const { data } = await api.get('/logistics/seller/all');
            setSellers(data);
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load sellers' });
        }
    };

    useEffect(() => {
        loadSellers();
    }, []);

    const saveSeller = async () => {
        try {
            if (seller.id) {
                await api.put(`/logistics/seller/${seller.id}`, seller);
            } else {
                await api.post('/logistics/seller/add', seller);
            }
            setDialogVisible(false);
            setSeller({ name: '', emailId: '', phoneNo: '', address: '', rating: 0 });
            loadSellers();
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Seller saved' });
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to save seller' });
        }
    };

    const deleteSeller = async (id) => {
        try {
            await api.delete(`/logistics/seller/${id}`);
            loadSellers();
            toast.current.show({ severity: 'success', summary: 'Deleted', detail: 'Seller removed' });
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete seller' });
        }
    };

    const editSeller = (s) => {
        setSeller({ ...s });
        setDialogVisible(true);
    };

    const actionTemplate = (rowData) => (
        <div className="flex gap-2">
            <Button icon="pi pi-pencil" className="p-button-text p-button-sm" onClick={() => editSeller(rowData)} />
            <Button icon="pi pi-trash" className="p-button-text p-button-danger p-button-sm" onClick={() => deleteSeller(rowData.id)} />
        </div>
    );

    return (
        <div className="p-4">
            <Toast ref={toast} />
            <Card title="Manage 3rd Party Sellers" className="shadow-2">
                <div className="mb-4">
                    <Button label="New Seller" icon="pi pi-plus" onClick={() => { setSeller({ name: '', emailId: '', phoneNo: '', address: '', rating: 0 }); setDialogVisible(true); }} />
                </div>

                <DataTable value={sellers} paginator rows={10} className="p-datatable-sm" responsiveLayout="scroll">
                    <Column field="id" header="ID" sortable />
                    <Column field="name" header="Name" sortable filter />
                    <Column field="emailId" header="Email" />
                    <Column field="phoneNo" header="Phone" />
                    <Column field="rating" header="Rating" sortable />
                    <Column field="address" header="Address" />
                    <Column body={actionTemplate} header="Actions" style={{ width: '100px' }} />
                </DataTable>
            </Card>

            <Dialog header={seller.id ? "Edit Seller" : "Add New Seller"} visible={dialogVisible} style={{ width: '450px' }} onHide={() => setDialogVisible(false)}>
                <div className="flex flex-column gap-3 p-fluid">
                    <div>
                        <label htmlFor="name" className="block font-bold mb-1">Company Name</label>
                        <InputText id="name" value={seller.name} onChange={(e) => setSeller({ ...seller, name: e.target.value })} autoFocus />
                    </div>
                    <div>
                        <label htmlFor="email" className="block font-bold mb-1">Email</label>
                        <InputText id="email" value={seller.emailId} onChange={(e) => setSeller({ ...seller, emailId: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block font-bold mb-1">Phone</label>
                        <InputText id="phone" value={seller.phoneNo} onChange={(e) => setSeller({ ...seller, phoneNo: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="rating" className="block font-bold mb-1">Rating</label>
                        <InputNumber id="rating" value={seller.rating} onValueChange={(e) => setSeller({ ...seller, rating: e.value })} minFractionDigits={1} maxFractionDigits={2} />
                    </div>
                    <div>
                        <label htmlFor="address" className="block font-bold mb-1">Address</label>
                        <InputText id="address" value={seller.address} onChange={(e) => setSeller({ ...seller, address: e.target.value })} />
                    </div>
                    <div className="mt-2">
                        <Button label="Save" icon="pi pi-check" onClick={saveSeller} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
