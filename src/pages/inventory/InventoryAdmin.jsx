import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import api from '../../services/api'

export default function InventoryAdmin() {
    const [rows, setRows] = useState([])
    const [delta, setDelta] = useState(null)
    const [reason, setReason] = useState('Manual adjustment')
    const [pid, setPid] = useState(null)

    const load = async () => {
        try {
            const { data } = await api.get('/admin/inventory/stock');
            setRows(data)
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        load()
    }, [])

    const adjust = async () => {
        try {
            await api.post('/admin/inventory/adjust', { productId: Number(pid), delta: Number(delta), reason });
            setDelta(null);
            setPid(null);
            load()
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="p-4">
            <Card title="Inventory Management" subTitle="Adjust product stock levels" className="mb-4">
                <div className="grid p-fluid mb-4">
                    <div className="col-12 md:col-3">
                        <label htmlFor="pid" className="block mb-1">Product ID</label>
                        <InputNumber id="pid" value={pid} onValueChange={e => setPid(e.value)} placeholder="ID" />
                    </div>
                    <div className="col-12 md:col-3">
                        <label htmlFor="delta" className="block mb-1">Delta (+/-)</label>
                        <InputNumber id="delta" value={delta} onValueChange={e => setDelta(e.value)} placeholder="Quantity" />
                    </div>
                    <div className="col-12 md:col-4">
                        <label htmlFor="reason" className="block mb-1">Reason</label>
                        <InputText id="reason" value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason" />
                    </div>
                    <div className="col-12 md:col-2 flex align-items-end">
                        <Button label="Apply" icon="pi pi-check" onClick={adjust} disabled={!pid || delta === null} />
                    </div>
                </div>

                <DataTable value={rows} paginator rows={10} className="p-datatable-sm" responsiveLayout="scroll">
                    <Column field="id" header="ID" sortable style={{ width: '100px' }} />
                    <Column field="title" header="Product Title" sortable filter />
                    <Column field="quantity" header="Current Stock" sortable style={{ width: '150px' }} />
                </DataTable>
            </Card>
        </div>
    )
}
