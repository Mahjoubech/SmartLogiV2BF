



import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchMyParcels, selectAllColis } from '../colisSlice';
import { selectAuth } from '../../auth/authSlice';
import Table from '../../../components/ui/Table';

// Parcel interface removed as it was unused and replaced by ParcelRow


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
    interface ParcelRow {
        id: string; // id is string from backend usually, or number? slice says string in some places but here it seems to come from p.id which might be string. Let's assume string to match Table T constraint. Wait, p.id usually string in this project.
        trackingCode: string;
        recipient: string;
        destination: string;
        status: string;
        date: string;
    }

    const data: ParcelRow[] = parcels.map(p => ({
        id: String(p.id),
        trackingCode: `TRK-${String(p.id).substring(0, 8).toUpperCase()}`,
        recipient: p.destinataire ? `${p.destinataire.nom} ${p.destinataire.prenom}` : 'Unknown',
        destination: p.villeDestination || p.zone?.nom || 'N/A',
        status: p.statut,
        date: new Date(p.dateCreation).toLocaleDateString()
    }));

    // Import Column type if possible or just rely on inference with explicit typing
    // Since Column is not exported from Table.tsx (it is not?), I might need to export it or just use 'any' for column array type if lazy, but best to export it.
    // Let's check Table.tsx exports. It defines interface Column but doesn't export it? 
    // Ah, line 87 exports default Table.
    // I can't import Column interface if it's not exported.
    // I will export it in Table.tsx in a separate tool call if needed, but for now I can just define the columns array without explicit Column<T>[] annotation and let TS infer, OR define a local type matching it.
    // Better: Fix Table.tsx to export Column interface.
    
    // Actually, I'll modify ParcelList to just work.
    
    const columns = [
        { header: 'Tracking Code', accessor: 'trackingCode' as const, className: 'font-mono text-orange-600 font-bold' },
        { header: 'Recipient', accessor: 'recipient' as const, className: 'font-bold' },
        { header: 'Destination', accessor: 'destination' as const },
        { 
            header: 'Status', 
            accessor: (row: ParcelRow) => {
                const colors: Record<string, string> = {
                    'CREE': 'bg-slate-100 text-slate-700 border-slate-200',
                    'COLLECTE': 'bg-amber-100 text-amber-700 border-amber-200',
                    'EN_TRANSIT': 'bg-blue-100 text-blue-700 border-blue-200',
                    'LIVRE': 'bg-green-100 text-green-700 border-green-200',
                    'ANNULE': 'bg-red-100 text-red-700 border-red-200'
                };
                // Handle status mapping if needed or just use row.status
                const statusColor = colors[row.status] || 'bg-gray-100 text-gray-700 border-gray-200';
                
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
                        {row.status.replace(/_/g, ' ')}
                    </span>
                );
            }
        },
        { header: 'Date', accessor: 'date' as const },
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


