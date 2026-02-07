import React from 'react';

interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    className?: string; // For customized cell styling
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (row: T) => void;
    isLoading?: boolean;
    emptyMessage?: string;
}

function Table<T extends { id: number | string }>({ 
    data, 
    columns, 
    onRowClick, 
    isLoading,
    emptyMessage = "No data available" 
}: TableProps<T>) {
    
    if (isLoading) {
        return (
            <div className="w-full h-64 flex items-center justify-center bg-white rounded-2xl border border-stone-100">
                 <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-stone-400 font-medium">Loading data...</span>
                 </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
             <div className="w-full h-64 flex items-center justify-center bg-white rounded-2xl border border-stone-100">
                <div className="text-center text-stone-400">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                    <p>{emptyMessage}</p>
                </div>
            </div>
        );
    }

  return (
    <div className="overflow-hidden bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-t-4 border-stone-100 border-t-orange-500">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/50 text-xs uppercase tracking-wider text-stone-500 font-bold">
              {columns.map((col, idx) => (
                <th key={idx} className={`px-6 py-4 whitespace-nowrap ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {data.map((row) => (
              <tr 
                key={row.id} 
                onClick={() => onRowClick && onRowClick(row)}
                className={`group transition-colors duration-200 ${onRowClick ? 'cursor-pointer hover:bg-orange-50/30' : ''}`}
              >
                {columns.map((col, idx) => (
                  <td key={idx} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {typeof col.accessor === 'function' 
                        ? col.accessor(row) 
                        : (row[col.accessor] as React.ReactNode)
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
