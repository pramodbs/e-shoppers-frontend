import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Card } from 'primereact/card'
import { Message } from 'primereact/message'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function DeliveryDashboard() {
    const { user } = useAuth()
    const [deliveryPersonId, setDeliveryPersonId] = useState('')
    const [rows, setRows] = useState([])
    const [error, setError] = useState('')

    const load = async () => {
        setError('');
        if (!deliveryPersonId) {
            setError('Enter your numeric Delivery Person ID');
            return
        }
        try {
            const { data } = await api.get('/user/delivery/myorder', { params: { deliveryPersonId } });
            setRows(data)
        } catch (err) {
            setError('Failed to fetch orders. Please check your ID.');
        }
    }

    return (
        <div className="p-4">
            <Card title="My Delivery Orders" subTitle={`Logged in as: ${user?.firstName} (${user?.role})`} className="mb-4">
                {error && <Message severity="warn" text={error} className="w-full mb-3" />}
                
                <div className="flex gap-2 mb-4 p-fluid max-w-md">
                    <div className="flex-grow-1">
                        <InputText placeholder="Delivery Person ID" value={deliveryPersonId} onChange={e => setDeliveryPersonId(e.target.value)} />
                    </div>
                    <Button label="Load Orders" icon="pi pi-search" onClick={load} />
                </div>

                <DataTable value={rows} paginator rows={10} className="p-datatable-sm" responsiveLayout="scroll" emptyMessage="No orders found for this ID.">
                    <Column field="orderId" header="Order ID" sortable />
                    <Column field="userName" header="Customer" sortable />
                    <Column field="productName" header="Product" sortable />
                    <Column field="quantity" header="Qty" sortable />
                    <Column field="deliveryStatus" header="Status" sortable />
                    <Column field="deliveryDate" header="Delivery Date" sortable />
                </DataTable>
            </Card>
        </div>
    )
}

