import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import api from '../../services/api';

export default function InventoryList() {
    const [inventory, setInventory] = useState([]);
    const [products, setProducts] = useState([]);
    const [storerooms, setStorerooms] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [item, setItem] = useState({ productId: null, storeroomId: null, sellerId: null, quantity: 1 });
    const [dialogVisible, setDialogVisible] = useState(false);
    const toast = React.useRef(null);

    const loadData = async () => {
        try {
            const [prodRes, storeRes, sellRes] = await Promise.all([
                api.get('/admin/product'),
                api.get('/logistics/storeroom/all'),
                api.get('/logistics/seller/all')
            ]);
            setProducts(prodRes.data);
            setStorerooms(storeRes.data);
            setSellers(sellRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadInventoryForProduct = async (pid) => {
        if (!pid) return;
        try {
            const { data } = await api.get(`/logistics/inventory/product/${pid}`);
            setInventory(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const saveStock = async () => {
        try {
            await api.post('/logistics/inventory/add', item);
            setDialogVisible(false);
            loadInventoryForProduct(item.productId);
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Stock added' });
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to add stock' });
        }
    };

    const updateStock = async (id, qty) => {
        try {
            await api.patch(`/logistics/inventory/${id}?quantity=${qty}`);
            loadInventoryForProduct(item.productId);
            toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Stock updated' });
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Update failed' });
        }
    };

    return (
        <div className="p-4">
            <Toast ref={toast} />
            <Card title="Detailed Inventory Management" subTitle="Track stock across storerooms and sellers" className="shadow-2">
                <div className="grid p-fluid mb-4 align-items-end">
                    <div className="col-12 md:col-6 field">
                        <label className="block font-bold mb-1">Select Product to View Inventory</label>
                        <Dropdown value={item.productId} options={products} onChange={(e) => { setItem({ ...item, productId: e.value }); loadInventoryForProduct(e.value); }} optionLabel="title" optionValue="id" placeholder="Select a Product" filter />
                    </div>
                    <div className="col-12 md:col-3 flex pb-3">
                        <Button label="Add New Stock" icon="pi pi-plus" onClick={() => setDialogVisible(true)} disabled={!item.productId} />
                    </div>
                </div>

                {item.productId && (
                    <DataTable value={inventory} className="p-datatable-sm" responsiveLayout="scroll">
                        <Column field="storeroomName" header="Storeroom" />
                        <Column field="sellerName" header="Seller/Owner" />
                        <Column field="quantity" header="Quantity" body={(r) => (
                            <InputNumber value={r.quantity} onValueChange={(e) => updateStock(r.id, e.value)} showButtons buttonLayout="horizontal" 
                                decrementButtonIcon="pi pi-minus" incrementButtonIcon="pi pi-plus" className="w-full" style={{maxWidth: '150px'}} />
                        )} />
                    </DataTable>
                )}
            </Card>

            <Dialog header="Add Stock to Storeroom" visible={dialogVisible} style={{ width: '450px' }} onHide={() => setDialogVisible(false)}>
                <div className="flex flex-column gap-3 p-fluid">
                    <div>
                        <label className="block font-bold mb-1">Storeroom</label>
                        <Dropdown value={item.storeroomId} options={storerooms} onChange={(e) => setItem({ ...item, storeroomId: e.value })} optionLabel="name" optionValue="id" placeholder="Select Storeroom" />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">Seller (Optional)</label>
                        <Dropdown value={item.sellerId} options={sellers} onChange={(e) => setItem({ ...item, sellerId: e.value })} optionLabel="name" optionValue="id" placeholder="Select Seller" showClear />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">Initial Quantity</label>
                        <InputNumber value={item.quantity} onValueChange={(e) => setItem({ ...item, quantity: e.value })} min={0} />
                    </div>
                    <div className="mt-2">
                        <Button label="Submit" icon="pi pi-check" onClick={saveStock} disabled={!item.storeroomId} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
