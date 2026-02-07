



import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchMyParcels, selectAllColis } from '../colisSlice';
import { selectAuth } from '../../auth/authSlice';
import Table from '../../../components/ui/Table';

interface Parcel {
    id: number;
    trackingCode: string;
    recipient: string;
    destination: string;
    status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
    date: string;
}

const ParcelList = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(selectAuth);
    const parcels = useAppSelector(selectAllColis);
    const { isLoading, error } = useAppSelector(state => state.colis);

    useEffect(() => {
        if (user && user.id) {
            dispatch(fetchMyParcels({ userId: user.id }));
        }
    }, [dispatch, user]);

    // Map backend data to table format
    const data = parcels.map(p => ({
        id: p.id,
        trackingCode: `TRK-${p.id.substring(0, 8).toUpperCase()}`,
        recipient: `${p.destinataire.nom} ${p.destinataire.prenom}`,
        destination: p.villeDestination || p.zone?.nom || 'N/A',
        status: p.statut,
        date: new Date(p.dateCreation).toLocaleDateString()
    }));

    const columns = [
        { header: 'Tracking Code', accessor: 'trackingCode', className: 'font-mono text-orange-600 font-bold' },
        { header: 'Recipient', accessor: 'recipient', className: 'font-bold' },
        { header: 'Destination', accessor: 'destination' },
        { 
            header: 'Status', 
            accessor: (row: any) => {
                const colors: Record<string, string> = {
                    'CREE': 'bg-slate-100 text-slate-700 border-slate-200',
                    'COLLECTE': 'bg-amber-100 text-amber-700 border-amber-200',
                    'EN_TRANSIT': 'bg-blue-100 text-blue-700 border-blue-200',
                    'LIVRE': 'bg-green-100 text-green-700 border-green-200',
                    'ANNULE': 'bg-red-100 text-red-700 border-red-200'
                };
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colors[row.status] || 'bg-gray-100'}`}>
                        {row.status.replace('_', ' ')}
                    </span>
                );
            }
        },
        { header: 'Date', accessor: 'date' },
    ];

    if (isLoading && parcels.length === 0) return <div>Loading parcels...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">My Parcels</h2>
                    <p className="text-slate-500">Manage your recent shipments</p>
                </div>
                <div className="flex gap-2">
                     <button 
                        onClick={() => user?.id && dispatch(fetchMyParcels({ userId: user.id }))}
                        className="px-4 py-2 text-sm bg-white border border-stone-200 rounded-xl hover:bg-stone-50"
                     >
                        Refresh
                     </button>
                </div>
            </div>
            
            {parcels.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-stone-100">
                    <p className="text-stone-500">No parcels found. Create your first shipment!</p>
                </div>
            ) : (
                <Table data={data} columns={columns} />
            )}
        </div>
    );
};

export default ParcelList;


