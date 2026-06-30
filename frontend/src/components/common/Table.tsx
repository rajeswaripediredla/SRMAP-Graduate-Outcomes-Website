import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchField?: (row: T) => string;
  filterField?: (row: T) => string;
  filterOptions?: { value: string; label: string }[];
  itemsPerPage?: number;
}

export function Table<T>({
  data,
  columns,
  searchPlaceholder = 'Search...',
  searchField,
  filterField,
  filterOptions,
  itemsPerPage = 5,
}: TableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Apply Search and Filter
  const filteredData = data.filter((item) => {
    // Filter
    if (filterField && filterValue !== 'all') {
      if (filterField(item) !== filterValue) return false;
    }
    // Search
    if (searchField && searchTerm) {
      if (!searchField(item).toLowerCase().includes(searchTerm.toLowerCase())) return false;
    }
    return true;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Table controls */}
      {(searchField || filterField) && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-taupe/20 shadow-sm">
          {searchField && (
            <div className="relative w-full sm:w-72">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-text">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="block w-full rounded-lg border border-taupe/35 pl-9 pr-3.5 py-1.5 text-xs bg-transparent focus:border-mocha focus:ring-mocha/25"
              />
            </div>
          )}
          
          {filterField && filterOptions && (
            <div className="w-full sm:w-auto flex items-center space-x-2 self-end sm:self-auto">
              <span className="text-xs text-secondary-text font-medium">Filter:</span>
              <select
                value={filterValue}
                onChange={(e) => {
                  setFilterValue(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-taupe/35 text-xs bg-transparent px-3 py-1.5 focus:border-mocha focus:ring-mocha/25 text-primary-text"
              >
                <option value="all">All Records</option>
                {filterOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Table body */}
      <div className="overflow-x-auto rounded-lg border border-taupe/20 shadow-sm bg-white">
        <table className="min-w-full divide-y divide-taupe/15">
          <thead className="bg-[#FAF8F5]">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`
                    px-6 py-4.5 text-xs font-semibold text-primary-text/80 uppercase tracking-wider
                    ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                    ${col.className || ''}
                  `}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-taupe/10 bg-white">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-bg-base/40 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`
                        px-6 py-4 text-sm text-primary-text/90 whitespace-nowrap
                        ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                        ${col.className || ''}
                      `}
                    >
                      {col.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-secondary-text font-medium">
                  No records found matching the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 text-xs font-medium text-secondary-text">
          <div>
            Showing <span className="font-semibold text-primary-text">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-primary-text">
              {Math.min(startIndex + itemsPerPage, filteredData.length)}
            </span>{' '}
            of <span className="font-semibold text-primary-text">{filteredData.length}</span> entries
          </div>
          
          <div className="inline-flex space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-taupe/20 bg-white hover:bg-bg-base/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`
                    px-3 py-1 rounded border transition-all cursor-pointer
                    ${currentPage === p 
                      ? 'bg-walnut border-walnut text-white font-bold' 
                      : 'border-taupe/20 bg-white hover:bg-bg-base/60'}
                  `}
                >
                  {p}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-taupe/20 bg-white hover:bg-bg-base/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Table;
