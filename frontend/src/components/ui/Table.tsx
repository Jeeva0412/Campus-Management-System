import React from 'react';

interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
}

export function Table<T>({ columns, data, keyExtractor }: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto border-2 border-[var(--color-ink)]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[var(--color-ink)] text-[var(--color-paper)]">
            {columns.map((col, i) => (
              <th 
                key={i} 
                scope="col" 
                className="p-3 font-mono text-xs tracking-widest uppercase font-bold border-b-2 border-[var(--color-ink)]"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[var(--color-paper)] text-[var(--color-ink)]">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center font-mono text-sm text-[var(--color-paper-dim)]">
                NO RECORDS FOUND
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={keyExtractor(row)} className="border-b-2 border-[var(--color-ink)] last:border-b-0 hover:bg-[var(--color-paper-dim)]/20 transition-colors">
                {columns.map((col, i) => (
                  <td key={i} className="p-3 font-sans text-sm">
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
