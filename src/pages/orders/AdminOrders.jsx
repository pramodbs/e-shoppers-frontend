import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { Card } from 'primereact/card'
import { Divider } from 'primereact/divider'
import api from '../../services/api'

const STATUS = ['Delivered', 'On the Way', 'Pending', 'Processing']
const TIMES = ['Morning', 'Afternoon', 'Evening', 'Night']

export default function AdminOrders() {
    const [rows, setRows] = useState([])
    const [orderId, setOrderId] = useState('')
    const [dlgUpd, setDlgUpd] = useState(false)
    const [dlgAssign, setDlgAssign] = useState(false)
    const [dlgDetails, setDlgDetails] = useState(false)
    const [selected, setSelected] = useState(null)
    const [upd, setUpd] = useState({
        orderId: '',
        deliveryStatus: 'On the Way',
        deliveryTime: 'Morning',
        deliveryDate: ''
    })
    const [assign, setAssign] = useState({ orderId: '', deliveryId: '' })

    const loadAll = async () => {
        try {
            const { data } = await api.get('/user/admin/allorder');
            setRows(data)
        } catch (err) {
            console.error(err);
        }
    }
    const searchById = async () => {
        if (!orderId) return;
        try {
            const { data } = await api.get(`/user/admin/showorder`, { params: { orderId } });
            setRows(data)
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        loadAll()
    }, [])

    const openUpd = (oid) => {
        setUpd({ orderId: oid, deliveryStatus: 'On the Way', deliveryTime: 'Morning', deliveryDate: '' });
        setDlgUpd(true)
    }
    const openAssign = (oid) => {
        setAssign({ orderId: oid, deliveryId: '' });
        setDlgAssign(true)
    }
    const openDetails = (row) => {
        setSelected(row);
        setDlgDetails(true)
    }
    const saveUpd = async () => {
        try {
            await api.post('/user/admin/order/deliveryStatus/update', upd);
            setDlgUpd(false);
            (orderId ? searchById() : loadAll())
        } catch (err) {
            console.error(err);
        }
    }
    const saveAssign = async () => {
        try {
            await api.post('/user/admin/order/assignDelivery', assign);
            setDlgAssign(false);
            (orderId ? searchById() : loadAll())
        } catch (err) {
            console.error(err);
        }
    }

    const actionTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button label="View" icon="pi pi-eye" className="p-button-text p-button-sm" onClick={() => openDetails(rowData)} />
                <Button label="Update" icon="pi pi-refresh" className="p-button-text p-button-sm" onClick={() => openUpd(rowData.orderId)} />
                <Button label="Assign" icon="pi pi-user-plus" className="p-button-text p-button-sm" onClick={() => openAssign(rowData.orderId)} />
            </div>
        );
    }

    return (
        <div className="p-4">
            <Card title="Orders Management" subTitle="Administrator View" className="mb-4">
                <div className="flex gap-2 mb-4 p-fluid max-w-lg">
                    <div className="flex-grow-1">
                        <InputText placeholder="Search by Order ID" value={orderId} onChange={e => setOrderId(e.target.value)} />
                    </div>
                    <Button label="Search" icon="pi pi-search" className="p-button-outlined" onClick={searchById} />
                    <Button label="Load All" icon="pi pi-sync" onClick={() => { setOrderId(''); loadAll() }} />
                </div>

                <DataTable value={rows} paginator rows={10} className="p-datatable-sm" responsiveLayout="scroll">
                    <Column field="orderId" header="Order ID" sortable />
                    <Column field="userName" header="User" sortable />
                    <Column field="productName" header="Product" sortable />
                    <Column field="quantity" header="Qty" sortable />
                    <Column field="totalPrice" header="Total" sortable />
                    <Column field="deliveryStatus" header="Status" sortable />
                    <Column field="deliveryDate" header="Delivery Date" sortable />
                    <Column field="deliveryPersonName" header="Delivery Person" sortable />
                    <Column header="Actions" body={actionTemplate} style={{ width: '250px', textAlign: 'right' }} />
                </DataTable>
            </Card>

            <Dialog visible={dlgUpd} onHide={() => setDlgUpd(false)} header="Update Delivery" modal style={{ width: '400px' }}
                footer={<div className="flex gap-2 justify-content-end"><Button label="Cancel" className="p-button-text" onClick={() => setDlgUpd(false)} /><Button label="Save" onClick={saveUpd} /></div>}>
                <div className="p-fluid">
                    <div className="field mb-3">
                        <label className="block mb-1">Delivery Status</label>
                        <Dropdown value={upd.deliveryStatus} options={STATUS} onChange={e => setUpd({ ...upd, deliveryStatus: e.value })} placeholder="Select Status" />
                    </div>
                    <div className="field mb-3">
                        <label className="block mb-1">Delivery Time</label>
                        <Dropdown value={upd.deliveryTime} options={TIMES} onChange={e => setUpd({ ...upd, deliveryTime: e.value })} placeholder="Select Time" />
                    </div>
                    <div className="field mb-3">
                        <label className="block mb-1">Delivery Date</label>
                        <InputText value={upd.deliveryDate} onChange={e => setUpd({ ...upd, deliveryDate: e.target.value })} placeholder="yyyy-MM-dd" />
                    </div>
                </div>
            </Dialog>

            <Dialog visible={dlgAssign} onHide={() => setDlgAssign(false)} header="Assign Delivery Person" modal style={{ width: '400px' }}
                footer={<div className="flex gap-2 justify-content-end"><Button label="Cancel" className="p-button-text" onClick={() => setDlgAssign(false)} /><Button label="Assign" onClick={saveAssign} /></div>}>
                <div className="p-fluid">
                    <div className="field mb-3">
                        <label className="block mb-1">Order ID</label>
                        <InputText value={assign.orderId} disabled />
                    </div>
                    <div className="field mb-3">
                        <label className="block mb-1">Delivery Person ID</label>
                        <InputText value={assign.deliveryId} onChange={e => setAssign({ ...assign, deliveryId: e.target.value })} placeholder="Enter Numeric ID" />
                    </div>
                </div>
            </Dialog>

            <Dialog visible={dlgDetails} onHide={() => setDlgDetails(false)} header="Order Details" modal style={{ width: '600px' }}>
                {selected && (
                    <div className="p-fluid">
                        <div className="text-xl font-bold mb-2">Order</div>
                        <div className="grid mb-3">
                            <div className="col-4"><b>ID:</b> {selected.orderId}</div>
                            <div className="col-4"><b>Date:</b> {selected.orderDate}</div>
                            <div className="col-4"><b>Status:</b> {selected.deliveryStatus}</div>
                        </div>
                        <Divider />
                        <div className="text-xl font-bold mb-2 pt-2">Product</div>
                        <div className="grid mb-1">
                            <div className="col-8"><b>Name:</b> {selected.productName}</div>
                            <div className="col-2"><b>Qty:</b> {selected.quantity}</div>
                            <div className="col-2"><b>Total:</b> {selected.totalPrice}</div>
                        </div>
                        <div className="mb-3"><b>Description:</b> {selected.productDescription}</div>
                        <Divider />
                        <div className="text-xl font-bold mb-2 pt-2">Customer</div>
                        <div className="grid mb-1">
                            <div className="col-4"><b>User ID:</b> {selected.userId}</div>
                            <div className="col-8"><b>Name:</b> {selected.userName}</div>
                        </div>
                        <div className="mb-2"><b>Phone:</b> {selected.userPhone}</div>
                        {selected.address && (
                            <div className="mb-3">
                                <b>Address:</b> {selected.address.street}, {selected.address.city}, {selected.address.state}, {selected.address.country} - {selected.address.pincode}
                            </div>
                        )}
                        <Divider />
                        <div className="text-xl font-bold mb-2 pt-2">Delivery</div>
                        <div className="grid">
                            <div className="col-4"><b>Date:</b> {selected.deliveryDate}</div>
                            <div className="col-4"><b>Person:</b> {selected.deliveryPersonName || 'PENDING'}</div>
                            <div className="col-4"><b>Contact:</b> {selected.deliveryPersonContact || 'PENDING'}</div>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    )
}

